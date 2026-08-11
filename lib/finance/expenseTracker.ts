export interface ExpenseCategory {
  label: string;
  amount: number;
  essential: boolean;
}

export interface ExpenseInputs {
  income: number;
  rent: number;
  hasEmi: boolean;
  emi: number;
  food: number;
  transport: number;
  utilities: number;
  insurance: number;
  investment: number;
  shopping: number;
  outings: { label: string; amount: number }[];
  currentEmergencySavings: number;
  actualMonthlySavings: number; // 0/blank = not provided, falls back to availableAfterExpenses
}

export type GoalStatus = "reached" | "days" | "months" | "unknown";

export interface EmergencyMilestone {
  months: number;
  label: string; // "1 month", "3 months", etc.
  target: number;
  reached: boolean;
  percent: number; // 0-100, unrounded — round only at display time
}

export interface ExpenseSummary {
  income: number;
  categories: ExpenseCategory[];
  totalEssential: number;
  totalDiscretionary: number;
  totalExpenses: number;
  availableAfterExpenses: number;
  availableAfterExpensesRate: number;
  actualMonthlySavings: number;
  effectiveMonthlySavings: number; // what's actually used for projections
  isEstimatedSavings: boolean; // true if actualMonthlySavings wasn't provided

  essentialFund1Month: number;
  essentialFund3Month: number;
  essentialFund6Month: number;
  lifestyleFund3Month: number;
  lifestyleFund6Month: number;

  currentEmergencySavings: number;
  primaryGoal: number; // essentialFund3Month — the default target for the progress bar
  remainingToGoal: number;
  progressPercent: number; // unrounded, 0-100, format at display time

  goalStatus: GoalStatus;
  goalTimeValue: number | null; // days or months, per goalStatus

  // 1/3/6-month health table — each milestone's own reached/percent state,
  // so the UI can show all three at once instead of just the primary goal.
  milestones: EmergencyMilestone[];
}

export function calculateExpenses(inputs: ExpenseInputs): ExpenseSummary {
  const {
    income,
    rent,
    hasEmi,
    emi,
    food,
    transport,
    utilities,
    insurance,
    investment,
    shopping,
    outings,
    currentEmergencySavings,
    actualMonthlySavings,
  } = inputs;

  const outingTotal = outings.reduce((sum, o) => sum + (o.amount || 0), 0);

  const categories: ExpenseCategory[] = [
    { label: "Rent", amount: rent, essential: true },
    ...(hasEmi ? [{ label: "EMI / Debt", amount: emi, essential: true }] : []),
    { label: "Food", amount: food, essential: true },
    { label: "Transport", amount: transport, essential: true },
    { label: "Utilities", amount: utilities, essential: true },
    { label: "Insurance", amount: insurance, essential: true },
    { label: "Investment", amount: investment, essential: true },
    { label: "Shopping", amount: shopping, essential: false },
    { label: "Outing", amount: outingTotal, essential: false },
  ].filter((c) => c.amount > 0);

  const totalEssential = round2(
    categories.filter((c) => c.essential).reduce((sum, c) => sum + c.amount, 0)
  );
  const totalDiscretionary = round2(
    categories.filter((c) => !c.essential).reduce((sum, c) => sum + c.amount, 0)
  );
  const totalExpenses = round2(totalEssential + totalDiscretionary);

  const availableAfterExpenses = round2(income - totalExpenses);
  const availableAfterExpensesRate =
    income > 0 ? round2((availableAfterExpenses / income) * 100) : 0;

  const isEstimatedSavings = actualMonthlySavings <= 0;
  const effectiveMonthlySavings = isEstimatedSavings
    ? Math.max(0, availableAfterExpenses)
    : actualMonthlySavings;

  const essentialFund1Month = round2(totalEssential * 1);
  const essentialFund3Month = round2(totalEssential * 3);
  const essentialFund6Month = round2(totalEssential * 6);
  const lifestyleFund3Month = round2((totalEssential + totalDiscretionary) * 3);
  const lifestyleFund6Month = round2((totalEssential + totalDiscretionary) * 6);

  const safeCurrentSavings = Math.max(0, currentEmergencySavings);
  const primaryGoal = essentialFund3Month;
  const remainingToGoal = Math.max(0, round2(primaryGoal - safeCurrentSavings));
  const progressPercent =
    primaryGoal > 0 ? Math.min(100, (safeCurrentSavings / primaryGoal) * 100) : 0;

  let goalStatus: GoalStatus;
  let goalTimeValue: number | null;

  if (primaryGoal === 0) {
    goalStatus = "unknown";
    goalTimeValue = null;
  } else if (remainingToGoal === 0) {
    goalStatus = "reached";
    goalTimeValue = null;
  } else if (effectiveMonthlySavings <= 0) {
    goalStatus = "unknown";
    goalTimeValue = null;
  } else {
    const monthsFraction = remainingToGoal / effectiveMonthlySavings;
    if (monthsFraction < 1) {
      goalStatus = "days";
      goalTimeValue = Math.max(1, Math.round(monthsFraction * 30));
    } else {
      goalStatus = "months";
      goalTimeValue = Math.max(1, Math.round(monthsFraction));
    }
  }

  const milestoneDefs: [number, string, number][] = [
    [1, "1 month", essentialFund1Month],
    [3, "3 months", essentialFund3Month],
    [6, "6 months", essentialFund6Month],
  ];

  const milestones: EmergencyMilestone[] = milestoneDefs.map(([months, label, target]) => ({
    months,
    label,
    target,
    reached: target > 0 && safeCurrentSavings >= target,
    percent: target > 0 ? Math.min(100, (safeCurrentSavings / target) * 100) : 0,
  }));

  return {
    income,
    categories,
    totalEssential,
    totalDiscretionary,
    totalExpenses,
    availableAfterExpenses,
    availableAfterExpensesRate,
    actualMonthlySavings,
    effectiveMonthlySavings,
    isEstimatedSavings,
    essentialFund1Month,
    essentialFund3Month,
    essentialFund6Month,
    lifestyleFund3Month,
    lifestyleFund6Month,
    currentEmergencySavings: safeCurrentSavings,
    primaryGoal,
    remainingToGoal,
    progressPercent,
    goalStatus,
    goalTimeValue,
    milestones,
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}