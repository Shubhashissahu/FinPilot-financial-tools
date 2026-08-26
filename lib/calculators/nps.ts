export interface NpsResult {
  totalInvested: number;
  interestEarned: number;
  maturityAmount: number;
  lumpSumValue: number;
  annuityValue: number;
  monthlyPension: number;
}

export function calculateNps(
  monthlyInvestment: number,
  expectedReturnPercent: number,
  currentAge: number,
  retirementAge: number,
  annuityPercent: number,
  annuityRatePercent: number
): NpsResult {
  const years = Math.max(0, retirementAge - currentAge);
  if (monthlyInvestment <= 0 || years <= 0) {
    return {
      totalInvested: 0,
      interestEarned: 0,
      maturityAmount: 0,
      lumpSumValue: 0,
      annuityValue: 0,
      monthlyPension: 0,
    };
  }

  const months = years * 12;
  const monthlyRate = expectedReturnPercent / 12 / 100;

  let corpus = 0;
  let totalInvested = 0;

  for (let month = 1; month <= months; month++) {
    corpus = (corpus + monthlyInvestment) * (1 + monthlyRate);
    totalInvested += monthlyInvestment;
  }

  const interestEarned = corpus - totalInvested;
  
  const annuityValue = corpus * (annuityPercent / 100);
  const lumpSumValue = corpus - annuityValue;

  const annualPension = annuityValue * (annuityRatePercent / 100);
  const monthlyPension = annualPension / 12;

  return {
    totalInvested: Math.round(totalInvested),
    interestEarned: Math.round(interestEarned),
    maturityAmount: Math.round(corpus),
    lumpSumValue: Math.round(lumpSumValue),
    annuityValue: Math.round(annuityValue),
    monthlyPension: Math.round(monthlyPension),
  };
}

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}
