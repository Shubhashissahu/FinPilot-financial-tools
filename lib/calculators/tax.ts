//lib/taxcalculators
export interface TaxSlabRow {
  label: string;
  amount: number;
}

export interface TaxResult {
  totalTax: number;
  effectiveRate: number;
  netIncome: number;
  breakdown: TaxSlabRow[];
}

const STANDARD_DEDUCTION = 75000;

interface Slab {
  upTo: number;
  rate: number;
}

function calculateWithSlabs(
  annualIncome: number,
  slabs: Slab[],
  rebateThreshold: number
): TaxResult {
  const taxable = Math.max(0, annualIncome - STANDARD_DEDUCTION);

  const breakdown: TaxSlabRow[] = [];
  let remaining = taxable;
  let prevLimit = 0;
  let baseTax = 0;

  for (const slab of slabs) {
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

  if (taxable <= rebateThreshold) {
    // Full Section 87A rebate.
    if (baseTax > 0) {
      breakdown.push({ label: "Rebate under Section 87A", amount: -Math.round(baseTax) });
    }
    taxAfterRelief = 0;
  } else {
    const excessOverThreshold = taxable - rebateThreshold;
    if (baseTax > excessOverThreshold) {
      const relief = baseTax - excessOverThreshold;
      breakdown.push({ label: "Marginal Relief", amount: -Math.round(relief) });
      taxAfterRelief = excessOverThreshold;
    } else {
      taxAfterRelief = baseTax;
    }
  }

  const cess = Math.round(taxAfterRelief * 0.04);
  if (cess > 0) {
    breakdown.push({ label: "Health & Education Cess (4%)", amount: cess });
  }

  const totalTax = Math.round(taxAfterRelief + cess);

  return {
    totalTax,
    effectiveRate: annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0,
    netIncome: annualIncome - totalTax,
    breakdown,
  };
}

/** New Tax Regime, FY 2024-25 (AY 2025-26). Rebate/relief threshold: ₹7,00,000. */
function calculateFY2024_25(annualIncome: number): TaxResult {
  const slabs: Slab[] = [
    { upTo: 300000, rate: 0 },
    { upTo: 700000, rate: 0.05 },
    { upTo: 1000000, rate: 0.1 },
    { upTo: 1200000, rate: 0.15 },
    { upTo: 1500000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ];
  return calculateWithSlabs(annualIncome, slabs, 700000);
}

/**
 * New Tax Regime, FY 2026-27 (AY 2027-28) — Budget 2026 made no changes
 * from FY 2025-26. Rebate/relief threshold: ₹12,00,000.
 */
function calculateFY2026_27(annualIncome: number): TaxResult {
  const slabs: Slab[] = [
    { upTo: 400000, rate: 0 },
    { upTo: 800000, rate: 0.05 },
    { upTo: 1200000, rate: 0.1 },
    { upTo: 1600000, rate: 0.15 },
    { upTo: 2000000, rate: 0.2 },
    { upTo: 2400000, rate: 0.25 },
    { upTo: Infinity, rate: 0.3 },
  ];
  return calculateWithSlabs(annualIncome, slabs, 1200000);
}

export function compareTax(annualIncome: number) {
  return {
    fy2024_25: calculateFY2024_25(annualIncome),
    fy2026_27: calculateFY2026_27(annualIncome),
  };
}