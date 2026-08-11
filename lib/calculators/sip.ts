export interface SipResult {
  totalInvested: number;
  totalGains: number;
  maturityValue: number;
  wealthRatio: number;
}

/**
 * Month-by-month simulation rather than a closed-form formula. A step-up
 * SIP (monthly contribution rising each year) doesn't have a clean
 * closed-form annuity formula, and a simulation is far easier to verify
 * correct than a formula that's easy to get subtly wrong. 40 years max =
 * 480 iterations, trivial cost.
 */
export function calculateSip(
  monthlyAmount: number,
  annualReturnPercent: number,
  years: number,
  annualStepUpPercent: number = 0
): SipResult {
  if (monthlyAmount <= 0 || years <= 0) {
    return { totalInvested: 0, totalGains: 0, maturityValue: 0, wealthRatio: 0 };
  }

  const months = Math.round(years * 12);
  const monthlyRate = annualReturnPercent / 12 / 100;

  let corpus = 0;
  let totalInvested = 0;
  let currentMonthly = monthlyAmount;

  for (let month = 1; month <= months; month++) {
    // Step up the contribution at the start of each new year (after the
    // first), before that month's contribution is added.
    if (month > 1 && (month - 1) % 12 === 0) {
      currentMonthly = currentMonthly * (1 + annualStepUpPercent / 100);
    }

    // Contribution made at the start of the month, then grows for that
    // month (annuity-due convention — matches how SIPs are typically
    // quoted and matches the reference numbers).
    corpus = (corpus + currentMonthly) * (1 + monthlyRate);
    totalInvested += currentMonthly;
  }

  const totalGains = corpus - totalInvested;

  return {
    totalInvested: round2(totalInvested),
    totalGains: round2(totalGains),
    maturityValue: round2(corpus),
    wealthRatio: totalInvested > 0 ? round2(corpus / totalInvested) : 0,
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
export function formatLakh(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  return `₹${(amount / 100000).toFixed(2)}L`;
}