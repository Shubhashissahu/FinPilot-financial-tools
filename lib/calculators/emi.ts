export interface EmiResult {
  monthlyEmi: number;
  yearlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  tenureMonths: number;
}

/**
 * Standard reducing-balance EMI formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where P = principal, r = monthly interest rate (annual/12/100),
 * n = tenure in months.
 */
export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number
): EmiResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return {
      monthlyEmi: 0,
      yearlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      principal,
      tenureMonths,
    };
  }

  const monthlyRate = annualRatePercent / 12 / 100;

  let monthlyEmi: number;
  if (monthlyRate === 0) {
    // 0% interest — EMI is just principal spread evenly, avoid divide-by-zero
    // in the compound formula below.
    monthlyEmi = principal / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyEmi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEmi: round2(monthlyEmi),
    yearlyPayment: round2(monthlyEmi * 12),
    totalInterest: round2(totalInterest),
    totalPayment: round2(totalPayment),
    principal,
    tenureMonths,
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}