export interface FdResult {
  principal: number;
  maturityValue: number;
  totalInterest: number;
  effectiveAnnualYield: number; 
}


export function calculateFd(
  principal: number,
  annualRatePercent: number,
  tenureYears: number,
  compoundingPerYear: number = 4
): FdResult {
  if (principal <= 0 || tenureYears <= 0 || annualRatePercent < 0) {
    return {
      principal,
      maturityValue: principal,
      totalInterest: 0,
      effectiveAnnualYield: 0,
    };
  }

  const r = annualRatePercent / 100;
  const n = compoundingPerYear;
  const t = tenureYears;

  const maturityValue = principal * Math.pow(1 + r / n, n * t);
  const totalInterest = maturityValue - principal;

  
  const effectiveAnnualYield = (Math.pow(1 + r / n, n) - 1) * 100;

  return {
    principal,
    maturityValue: round2(maturityValue),
    totalInterest: round2(totalInterest),
    effectiveAnnualYield: round2(effectiveAnnualYield),
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}