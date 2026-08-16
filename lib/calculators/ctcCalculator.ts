// lib/ctcCalculator.ts

import { compareTax } from "@/lib/calculators/tax";

export interface CtcBreakdown {
  basic: number;
  hra: number;
  da: number;
  lta: number;
  specialAllowance: number;
  performanceBonus: number;
  grossSalary: number;
  standardDeduction: number;
  taxableIncome: number;
  pfWageBase: number;
  employeeEpf: number;
  employerEpf: number;
  esiApplicable: boolean;
  employeeEsi: number;
  employerEsi: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;
  netAnnualSalary: number;
  netMonthlySalary: number;
  effectiveCtc: number; // gross + employer-side contributions, the real employer cost
  componentsCapped: boolean; // true if input percentages exceeded 100% and were scaled down
}

export interface CtcInputs {
  annualCtc: number;
  hraPercent: number;
  daPercent: number;
  ltaPercent: number;
  specialAllowancePercent: number;
  performanceBonusPercent: number;
  epfApplicable: boolean;
  pfWageCapped: boolean; // true = cap at ₹15,000/month, false = actual Basic+DA
  employeeEpfPercent: number;
  employerEpfPercent: number;
  professionalTaxApplicable: boolean;
}

export const STANDARD_DEDUCTION = 75000; // exported so taxCalculator.ts (or anything
// else) can reference the same constant instead of each file hardcoding its own copy
const PF_WAGE_CEILING_MONTHLY = 15000;
const ESI_WAGE_CEILING_MONTHLY = 21000;
const ESI_EMPLOYEE_RATE = 0.0075;
const ESI_EMPLOYER_RATE = 0.0325;
const FLAT_PROFESSIONAL_TAX_MONTHLY = 200; // simplified default — see disclaimer in UI

export function calculateCtc(inputs: CtcInputs): CtcBreakdown {
  const {
    annualCtc: rawAnnualCtc,
    epfApplicable,
    pfWageCapped,
    employeeEpfPercent: rawEmployeeEpfPercent,
    employerEpfPercent: rawEmployerEpfPercent,
    professionalTaxApplicable,
  } = inputs;

  // Guard against negative inputs reaching the math — the UI already
  // constrains these, but the function shouldn't trust its caller.
  const annualCtc = Math.max(0, rawAnnualCtc);
  const hraPercent = Math.max(0, inputs.hraPercent);
  const daPercent = Math.max(0, inputs.daPercent);
  const ltaPercent = Math.max(0, inputs.ltaPercent);
  const specialAllowancePercent = Math.max(0, inputs.specialAllowancePercent);
  const performanceBonusPercent = Math.max(0, inputs.performanceBonusPercent);
  const employeeEpfPercent = Math.max(0, rawEmployeeEpfPercent);
  const employerEpfPercent = Math.max(0, rawEmployerEpfPercent);

  const rawAllocatedPercent =
    hraPercent + daPercent + ltaPercent + specialAllowancePercent + performanceBonusPercent;

  // If the allowance percentages alone exceed 100%, Basic would go negative
  // and gross salary would exceed the entered CTC — neither is a valid
  // salary structure. Scale every component down proportionally so they
  // always sum to at most 100%, leaving Basic at 0 in the extreme case.
  const componentsCapped = rawAllocatedPercent > 100;
  const scaleFactor = componentsCapped ? 100 / rawAllocatedPercent : 1;

  const scaledHraPercent = hraPercent * scaleFactor;
  const scaledDaPercent = daPercent * scaleFactor;
  const scaledLtaPercent = ltaPercent * scaleFactor;
  const scaledSpecialAllowancePercent = specialAllowancePercent * scaleFactor;
  const scaledPerformanceBonusPercent = performanceBonusPercent * scaleFactor;

  const allocatedPercent =
    scaledHraPercent +
    scaledDaPercent +
    scaledLtaPercent +
    scaledSpecialAllowancePercent +
    scaledPerformanceBonusPercent;
  const basicPercent = Math.max(0, 100 - allocatedPercent);

  const hra = round2(annualCtc * (scaledHraPercent / 100));
  const da = round2(annualCtc * (scaledDaPercent / 100));
  const lta = round2(annualCtc * (scaledLtaPercent / 100));
  const specialAllowance = round2(annualCtc * (scaledSpecialAllowancePercent / 100));
  const performanceBonus = round2(annualCtc * (scaledPerformanceBonusPercent / 100));
  const basic = round2(annualCtc * (basicPercent / 100));

  const grossSalary = round2(basic + hra + da + lta + specialAllowance + performanceBonus);

  // EPF is typically calculated on Basic + DA.
  const monthlyBasicPlusDa = (basic + da) / 12;
  const pfWageBase = epfApplicable
    ? round2(
        (pfWageCapped
          ? Math.min(monthlyBasicPlusDa, PF_WAGE_CEILING_MONTHLY)
          : monthlyBasicPlusDa) * 12
      )
    : 0;

  const employeeEpf = epfApplicable ? round2(pfWageBase * (employeeEpfPercent / 100)) : 0;
  const employerEpf = epfApplicable ? round2(pfWageBase * (employerEpfPercent / 100)) : 0;

  // ESI applies only if gross monthly wage is at or below the statutory
  // ceiling — most salaried CTC calculations above entry level won't
  // trigger this, matching how real payroll tools behave.
  const monthlyGross = grossSalary / 12;
  const esiApplicable = monthlyGross <= ESI_WAGE_CEILING_MONTHLY;
  const employeeEsi = esiApplicable ? round2(grossSalary * ESI_EMPLOYEE_RATE) : 0;
  const employerEsi = esiApplicable ? round2(grossSalary * ESI_EMPLOYER_RATE) : 0;

  const professionalTax = (professionalTaxApplicable && grossSalary > 0)
    ? FLAT_PROFESSIONAL_TAX_MONTHLY * 12
    : 0;

  const standardDeduction = STANDARD_DEDUCTION;
  const taxableIncome = Math.max(0, round2(grossSalary - standardDeduction));

  // Reuse the already-verified New Regime FY2026-27 tax logic rather than
  // re-deriving slab math a third time in this codebase. compareTax applies
  // its own standard deduction internally — taxableIncome above is shown
  // for display only, and stays consistent with it as long as both files
  // reference the same STANDARD_DEDUCTION export.
  const { fy2026_27 } = compareTax(grossSalary);
  const incomeTax = fy2026_27.totalTax;

  const totalDeductions = round2(employeeEpf + employeeEsi + professionalTax + incomeTax);
  const netAnnualSalary = round2(grossSalary - totalDeductions);
  const netMonthlySalary = round2(netAnnualSalary / 12);

  // The real cost to the employer includes their EPF/ESI contributions on
  // top of gross — this is the honest "total CTC" figure, shown separately
  // rather than silently folded into or confused with the entered amount.
  const effectiveCtc = round2(grossSalary + employerEpf + employerEsi);

  return {
    basic,
    hra,
    da,
    lta,
    specialAllowance,
    performanceBonus,
    grossSalary,
    standardDeduction,
    taxableIncome,
    pfWageBase,
    employeeEpf,
    employerEpf,
    esiApplicable,
    employeeEsi,
    employerEsi,
    professionalTax,
    incomeTax,
    totalDeductions,
    netAnnualSalary,
    netMonthlySalary,
    effectiveCtc,
    componentsCapped,
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}