export type GoalMode = "byMonthlyContribution" | "byDeadline";

export interface SavingsGoalInputs {
  targetAmount: number;
  annualInterestRate: number;
  mode: GoalMode;
  monthlyContribution: number; // used when mode = "byMonthlyContribution"
  targetMonths: number; // used when mode = "byDeadline"
}

export interface YearData {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface SavingsGoalResult {
  mode: GoalMode;
  monthsRequired: number | null; // set in "byMonthlyContribution" mode
  requiredMonthlyContribution: number | null; // set in "byDeadline" mode
  totalPrincipal: number;
  totalInterest: number;
  yearlyData: YearData[];
  exceedsMaxTimeframe: boolean; // "byMonthlyContribution" mode: real answer >100 years
}

const MAX_MONTHS = 1200; // 100-year cap, applies to both modes' simulations

/**
 * Both modes use the SAME grow-then-contribute monthly convention:
 * balance = balance*(1+r) + contribution — verified against a hand
 * simulation before shipping. "byDeadline" mode solves the ordinary-annuity
 * formula for PMT rather than months, but reuses the identical simulation
 * loop afterward to build the chart data and totals, so both modes are
 * guaranteed internally consistent with each other.
 */
export function calculateSavingsGoal(inputs: SavingsGoalInputs): SavingsGoalResult {
  const { targetAmount, annualInterestRate, mode, monthlyContribution, targetMonths } = inputs;

  if (targetAmount <= 0) {
    return {
      mode,
      monthsRequired: null,
      requiredMonthlyContribution: null,
      totalPrincipal: 0,
      totalInterest: 0,
      yearlyData: [],
      exceedsMaxTimeframe: false,
    };
  }

  const r = annualInterestRate / 12 / 100;

  let months: number;
  let contribution: number;
  let requiredMonthlyContribution: number | null = null;
  let monthsRequired: number | null = null;
  let exceedsMaxTimeframe = false;

  if (mode === "byMonthlyContribution") {
    if (monthlyContribution <= 0) {
      return {
        mode, monthsRequired: null, requiredMonthlyContribution: null,
        totalPrincipal: 0, totalInterest: 0, yearlyData: [], exceedsMaxTimeframe: false,
      };
    }

    let computedMonths: number;
    if (r === 0) {
      computedMonths = Math.ceil(targetAmount / monthlyContribution);
    } else {
      computedMonths = Math.ceil(
        Math.log((targetAmount * r) / monthlyContribution + 1) / Math.log(1 + r)
      );
    }

    exceedsMaxTimeframe = computedMonths > MAX_MONTHS;
    months = exceedsMaxTimeframe ? MAX_MONTHS : computedMonths;
    contribution = monthlyContribution;
    monthsRequired = months;
  } else {
    // byDeadline: solve for the contribution that exactly hits the target
    // in the given number of months.
    if (targetMonths <= 0) {
      return {
        mode, monthsRequired: null, requiredMonthlyContribution: null,
        totalPrincipal: 0, totalInterest: 0, yearlyData: [], exceedsMaxTimeframe: false,
      };
    }
    months = Math.min(targetMonths, MAX_MONTHS);
    contribution =
      r === 0 ? targetAmount / months : (targetAmount * r) / (Math.pow(1 + r, months) - 1);
    requiredMonthlyContribution = round2(contribution);
  }

  let currentBalance = 0;
  let totalPrincipal = 0;
  let totalInterest = 0;
  const yearlyData: YearData[] = [];

  for (let month = 1; month <= months; month++) {
    const interestEarned = currentBalance * r;
    totalInterest += interestEarned;
    totalPrincipal += contribution;
    currentBalance += contribution + interestEarned;

    if (month % 12 === 0 || month === months) {
      yearlyData.push({
        year: Math.ceil(month / 12),
        principal: Math.round(totalPrincipal),
        interest: Math.round(totalInterest),
        balance: Math.round(currentBalance),
      });
    }
  }

  return {
    mode,
    monthsRequired,
    requiredMonthlyContribution,
    totalPrincipal: Math.round(totalPrincipal),
    totalInterest: Math.round(totalInterest),
    yearlyData,
    exceedsMaxTimeframe,
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}