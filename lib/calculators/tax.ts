//lib/calculators/tax.ts
export interface TaxSlabRow {
  label: string;
  amount: number;
}

export interface TaxResult {
  totalTax: number;
  effectiveRate: number;
  netIncome: number;
  breakdown: TaxSlabRow[];
  taxableIncome: number;
}

export interface Slab {
  upTo: number;
  rate: number;
}

export interface TaxYearConfig {
  id: string;
  label: string;
  standardDeduction: number;
  rebateThreshold: number;
  maxRebate: number;
  slabs: Slab[];
}

export const TAX_YEARS: Record<string, TaxYearConfig> = {
  "fy2024_25": {
    id: "fy2024_25",
    label: "FY 2024-25 / AY 2025-26",
    standardDeduction: 50000,
    rebateThreshold: 700000,
    maxRebate: 25000,
    slabs: [
      { upTo: 300000, rate: 0 },
      { upTo: 700000, rate: 0.05 },
      { upTo: 1000000, rate: 0.1 },
      { upTo: 1200000, rate: 0.15 },
      { upTo: 1500000, rate: 0.2 },
      { upTo: Infinity, rate: 0.3 },
    ],
  },
  "fy2025_26": {
    id: "fy2025_26",
    label: "FY 2025-26 / AY 2026-27",
    standardDeduction: 75000,
    rebateThreshold: 700000,
    maxRebate: 25000,
    slabs: [
      { upTo: 300000, rate: 0 },
      { upTo: 700000, rate: 0.05 },
      { upTo: 1000000, rate: 0.1 },
      { upTo: 1200000, rate: 0.15 },
      { upTo: 1500000, rate: 0.2 },
      { upTo: Infinity, rate: 0.3 },
    ],
  },
  "ty2026_27": {
    id: "ty2026_27",
    label: "Tax Year 2026-27",
    standardDeduction: 75000,
    rebateThreshold: 1200000,
    maxRebate: 60000,
    slabs: [
      { upTo: 400000, rate: 0 },
      { upTo: 800000, rate: 0.05 },
      { upTo: 1200000, rate: 0.1 },
      { upTo: 1600000, rate: 0.15 },
      { upTo: 2000000, rate: 0.2 },
      { upTo: 2400000, rate: 0.25 },
      { upTo: Infinity, rate: 0.3 },
    ],
  },
};

export function calculateWithSlabs(
  annualIncome: number,
  config: TaxYearConfig
): TaxResult {
  const taxable = Math.max(0, annualIncome - config.standardDeduction);

  const breakdown: TaxSlabRow[] = [];
  let remaining = taxable;
  let prevLimit = 0;
  let baseTax = 0;

  for (const slab of config.slabs) {
    if (remaining <= 0) break;
    const slabWidth = slab.upTo - prevLimit;
    const amountInSlab = Math.min(remaining, slabWidth);
    if (amountInSlab > 0 && slab.rate > 0) {
      const taxForSlab = amountInSlab * slab.rate;
      baseTax += taxForSlab;
      breakdown.push({
        label: `₹${prevLimit.toLocaleString("en-IN")} - ₹${Math.min(
          slab.upTo,
          prevLimit + amountInSlab
        ).toLocaleString("en-IN")}`,
        amount: Math.round(taxForSlab),
      });
    }
    remaining -= amountInSlab;
    prevLimit = slab.upTo;
  }

  let taxAfterRelief: number;

  if (taxable <= config.rebateThreshold) {
    // Full Section 87A rebate.
    if (baseTax > 0) {
      breakdown.push({ label: "Rebate under Section 87A", amount: -Math.round(baseTax) });
    }
    taxAfterRelief = 0;
  } else {
    const excessOverThreshold = taxable - config.rebateThreshold;
    if (baseTax > excessOverThreshold) {
      const relief = baseTax - excessOverThreshold;
      breakdown.push({ label: "Marginal Relief (87A)", amount: -Math.round(relief) });
      taxAfterRelief = excessOverThreshold;
    } else {
      taxAfterRelief = baseTax;
    }
  }

  // --- SURCHARGE LOGIC ---
  const computeBaseTax = (incomeAmount: number) => {
    let t = 0;
    let r = incomeAmount;
    let p = 0;
    for (const slab of config.slabs) {
      if (r <= 0) break;
      const w = slab.upTo - p;
      const a = Math.min(r, w);
      if (a > 0 && slab.rate > 0) t += a * slab.rate;
      r -= a;
      p = slab.upTo;
    }
    return t;
  };

  let surchargeRate = 0;
  let surchargeThreshold = 0;
  let prevSurchargeRate = 0;

  if (taxable > 20000000) {
    surchargeRate = 0.25;
    surchargeThreshold = 20000000;
    prevSurchargeRate = 0.15;
  } else if (taxable > 10000000) {
    surchargeRate = 0.15;
    surchargeThreshold = 10000000;
    prevSurchargeRate = 0.10;
  } else if (taxable > 5000000) {
    surchargeRate = 0.10;
    surchargeThreshold = 5000000;
    prevSurchargeRate = 0;
  }

  let surchargeAmount = 0;
  if (surchargeRate > 0) {
    const rawSurcharge = taxAfterRelief * surchargeRate;
    
    const taxAtThreshold = computeBaseTax(surchargeThreshold);
    const surchargeAtThreshold = taxAtThreshold * prevSurchargeRate;
    const totalTaxAtThreshold = taxAtThreshold + surchargeAtThreshold;
    
    const maxTotalTax = totalTaxAtThreshold + (taxable - surchargeThreshold);
    const rawTotalTax = taxAfterRelief + rawSurcharge;

    if (rawTotalTax > maxTotalTax) {
      const surchargeRelief = rawTotalTax - maxTotalTax;
      surchargeAmount = rawSurcharge - surchargeRelief;
      
      breakdown.push({ label: `Surcharge (${surchargeRate * 100}%)`, amount: Math.round(rawSurcharge) });
      breakdown.push({ label: "Marginal Relief (Surcharge)", amount: -Math.round(surchargeRelief) });
    } else {
      surchargeAmount = rawSurcharge;
      breakdown.push({ label: `Surcharge (${surchargeRate * 100}%)`, amount: Math.round(surchargeAmount) });
    }
  }

  const taxBeforeCess = taxAfterRelief + surchargeAmount;
  const cess = Math.round(taxBeforeCess * 0.04);
  
  if (cess > 0) {
    breakdown.push({ label: "Health & Education Cess (4%)", amount: cess });
  }

  const totalTax = Math.round(taxBeforeCess + cess);

  return {
    totalTax,
    effectiveRate: annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0,
    netIncome: annualIncome - totalTax,
    taxableIncome: taxable,
    breakdown,
  };
}

export function calculateTaxForYear(annualIncome: number, yearId: string) {
  const config = TAX_YEARS[yearId];
  if (!config) throw new Error("Invalid tax year configuration");
  return calculateWithSlabs(annualIncome, config);
}