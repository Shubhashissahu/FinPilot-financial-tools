//app/expense-tracker/page.tsx
"use client";

import { useState, useMemo } from "react";
import { calculateExpenses, ExpenseInputs } from "@/lib/finance/expenseTracker";

function progressHeadline(percent: number): string {
  if (percent >= 100) return "🎉 Goal reached!";
  if (percent >= 75) return "🛡️ You're almost there!";
  if (percent >= 50) return "💪 Making solid progress";
  if (percent >= 1) return "🌱 Building your safety net";
  return "Let's get started";
}

export default function ExpenseTrackerPage() {
  const [income, setIncome] = useState("");
  const [rent, setRent] = useState("");
  const [hasEmi, setHasEmi] = useState(false);
  const [emi, setEmi] = useState("");
  const [food, setFood] = useState("");
  const [transport, setTransport] = useState("");
  const [utilities, setUtilities] = useState("");
  const [insurance, setInsurance] = useState("");
  const [investment, setInvestment] = useState("");
  const [shopping, setShopping] = useState("");
  const [outings, setOutings] = useState<{ label: string; amount: string }[]>([]);
  const [outingLabel, setOutingLabel] = useState("");
  const [outingAmount, setOutingAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [actualSavings, setActualSavings] = useState("");

  const num = (v: string) => Number(v.replace(/,/g, "")) || 0;

  const formatWithCommas = (raw: string, setter: (v: string) => void) => {
    const digits = raw.replace(/[^\d]/g, "");
    setter(digits ? Number(digits).toLocaleString("en-IN") : "");
  };

  const addOuting = () => {
    if (!outingLabel.trim() || !outingAmount || num(outingAmount) <= 0) return;
    setOutings((prev) => [...prev, { label: outingLabel.trim(), amount: outingAmount }]);
    setOutingLabel("");
    setOutingAmount("");
  };

  const removeOuting = (index: number) => {
    setOutings((prev) => prev.filter((_, i) => i !== index));
  };

  const inputs: ExpenseInputs = useMemo(
    () => ({
      income: num(income),
      rent: num(rent),
      hasEmi,
      emi: hasEmi ? num(emi) : 0,
      food: num(food),
      transport: num(transport),
      utilities: num(utilities),
      insurance: num(insurance),
      investment: num(investment),
      shopping: num(shopping),
      outings: outings.map((o) => ({ label: o.label, amount: num(o.amount) })),
      currentEmergencySavings: num(currentSavings),
      actualMonthlySavings: num(actualSavings),
    }),
    [
      income, rent, hasEmi, emi, food, transport, utilities, insurance, investment,
      shopping, outings, currentSavings, actualSavings,
    ]
  );

  const summary = calculateExpenses(inputs);
  const maxCategoryAmount = Math.max(1, ...summary.categories.map((c) => c.amount));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900/50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-4xl font-black text-green-700">
          Expense Tracker
        </h1>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400 dark:text-gray-500">
          See where your monthly income goes, and build toward a real
          emergency fund.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* LEFT: inputs */}
          <section className="space-y-6 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Monthly Income (₹)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={income}
                onChange={(e) => formatWithCommas(e.target.value, setIncome)}
                placeholder="e.g. 70,000"
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div className="border-t border-gray-100 dark:border-neutral-800 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Essential — necessities you can not easily cut
              </p>
              <div className="mt-3 space-y-3">
                <MoneyField label="Rent" value={rent} onChange={(v) => formatWithCommas(v, setRent)} />
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={hasEmi} onChange={(e) => setHasEmi(e.target.checked)} />
                  I have an EMI / debt payment
                </label>
                {hasEmi && (
                  <MoneyField label="EMI / Debt Amount" value={emi} onChange={(v) => formatWithCommas(v, setEmi)} />
                )}
                <MoneyField label="Food" value={food} onChange={(v) => formatWithCommas(v, setFood)} />
                <MoneyField label="Transport" value={transport} onChange={(v) => formatWithCommas(v, setTransport)} />
                <MoneyField label="Utilities" value={utilities} onChange={(v) => formatWithCommas(v, setUtilities)} />
                <MoneyField label="Insurance" value={insurance} onChange={(v) => formatWithCommas(v, setInsurance)} />
                <MoneyField label="Investment" value={investment} onChange={(v) => formatWithCommas(v, setInvestment)} />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-neutral-800 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Discretionary — the flexible part of your spending
              </p>
              <div className="mt-3 space-y-3">
                <MoneyField label="Shopping" value={shopping} onChange={(v) => formatWithCommas(v, setShopping)} />
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Outings</label>
                  <div className="mt-2 space-y-2">
                    {outings.map((o, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-neutral-900/50 px-3 py-2 text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{o.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900 dark:text-white">₹{o.amount}</span>
                          <button onClick={() => removeOuting(i)} className="text-gray-400 dark:text-gray-500 transition hover:text-red-600">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Movie night"
                      value={outingLabel}
                      onChange={(e) => setOutingLabel(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-500 outline-none focus:border-green-500"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="₹ amount"
                      value={outingAmount}
                      onChange={(e) => formatWithCommas(e.target.value, setOutingAmount)}
                      className="w-28 rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-500 outline-none focus:border-green-500"
                    />
                    <button onClick={addOuting} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-neutral-800 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Savings tracking
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Current emergency savings (₹)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={currentSavings}
                    onChange={(e) => formatWithCommas(e.target.value, setCurrentSavings)}
                    placeholder="0"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-500 outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    How much do you actually save each month? (₹)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={actualSavings}
                    onChange={(e) => formatWithCommas(e.target.value, setActualSavings)}
                    placeholder="Leave blank to estimate from income − expenses"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-500 outline-none focus:border-green-500"
                  />
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Optional, but more accurate than assuming you save
                    everything left over.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: results */}
          <div className="space-y-6">
            {/* Monthly financial picture */}
            <section className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 dark:text-white">Monthly Financial Picture</h2>
              <div className="mt-4 space-y-2 text-sm">
                <PictureRow label="Income" value={summary.income} bold />
                <PictureRow label="Essential expenses" value={summary.totalEssential} />
                <PictureRow label="Discretionary expenses" value={summary.totalDiscretionary} />
                <PictureRow label="Total spending" value={summary.totalExpenses} bold divider />
                <PictureRow label="Available After Expenses" value={summary.availableAfterExpenses} tone="green" bold />
              </div>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {summary.availableAfterExpensesRate}% of income is left over
                after tracked expenses — this is a ceiling, not what you
                necessarily bank each month.
              </p>
            </section>

            {summary.categories.length > 0 && (
              <section className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 dark:text-white">Expense Breakdown</h2>
                <div className="mt-4 space-y-3">
                  {summary.categories.map((c) => (
                    <div key={c.label}>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
                          {c.label}
                          {!c.essential && <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">(discretionary)</span>}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">₹{c.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-neutral-800">
                        <div
                          className={`h-2 rounded-full transition-all ${c.essential ? "bg-green-600" : "bg-amber-500"}`}
                          style={{ width: `${(c.amount / maxCategoryAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Emergency Fund health table */}
            {summary.totalEssential > 0 && (
              <section className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Emergency Fund</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Based on essential expenses of ₹{summary.totalEssential.toLocaleString("en-IN")}/mo
                  </span>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-neutral-900/50">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Target</th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Amount</th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {summary.milestones.map((m) => (
                        <tr key={m.months}>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{m.label}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                            ₹{m.target.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <MilestoneStatus reached={m.reached} percent={m.percent} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                  You currently have ₹{summary.currentEmergencySavings.toLocaleString("en-IN")} saved.
                </p>
              </section>
            )}

            {summary.totalEssential > 0 && (
              <section className="rounded-2xl bg-blue-50 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white">Your Emergency Fund Goal</h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Based on your 3-month Essential fund of ₹
                  {summary.primaryGoal.toLocaleString("en-IN")}
                </p>

                <p className="mt-4 text-sm font-semibold text-blue-800">
                  {progressHeadline(summary.progressPercent)}
                </p>

                <div className="mt-2">
                  <div className="h-3 rounded-full bg-white dark:bg-neutral-900">
                    <div
                      className="h-3 rounded-full bg-blue-600 transition-all"
                      style={{ width: `${Math.min(100, summary.progressPercent)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    ₹{summary.currentEmergencySavings.toLocaleString("en-IN")} / ₹
                    {summary.primaryGoal.toLocaleString("en-IN")} saved ·{" "}
                    <span className="font-medium text-blue-700">
                      {summary.progressPercent.toFixed(2)}% complete
                    </span>
                  </p>
                </div>

                {summary.goalStatus === "reached" ? (
                  <p className="mt-3 text-sm font-medium text-green-700">
                    You&apos;ve already reached this goal. 🎉
                  </p>
                ) : summary.goalStatus === "unknown" ? (
                  <p className="mt-3 text-sm text-red-600">
                    Not currently saving anything — enter an income and
                    savings amount above to see a projection.
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                    You need ₹{summary.remainingToGoal.toLocaleString("en-IN")}{" "}
                    more to reach your 3-month emergency fund. At your
                    {summary.isEstimatedSavings ? " estimated" : " current"}{" "}
                    saving rate of ₹
                    {summary.effectiveMonthlySavings.toLocaleString("en-IN")}
                    /month, you&apos;ll reach your goal in approximately{" "}
                    <span className="font-semibold text-blue-700">
                      {summary.goalTimeValue}{" "}
                      {summary.goalStatus === "days" ? "days" : "months"}
                    </span>
                    .
                    {summary.isEstimatedSavings && (
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        Estimated from Available After Expenses — enter your
                        actual monthly savings above for a more accurate
                        number.
                      </span>
                    )}
                  </p>
                )}

                <div className="mt-6 grid gap-4 border-t border-blue-100 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      🎯 Essential emergency fund
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      Covers only necessities
                    </p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      ₹{summary.totalEssential.toLocaleString("en-IN")} × 3 ={" "}
                      <span className="font-semibold text-blue-700">
                        ₹{summary.essentialFund3Month.toLocaleString("en-IN")}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      6 months: ₹{summary.essentialFund6Month.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      🎯 Full lifestyle emergency fund
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      Includes essential + recurring discretionary expenses
                    </p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      ₹{(summary.totalEssential + summary.totalDiscretionary).toLocaleString("en-IN")} × 3 ={" "}
                      <span className="font-semibold text-blue-700">
                        ₹{summary.lifestyleFund3Month.toLocaleString("en-IN")}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      6 months: ₹{summary.lifestyleFund6Month.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-700 dark:text-gray-300">{label} (₹)</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-500 outline-none focus:border-green-500"
      />
    </div>
  );
}

function PictureRow({
  label,
  value,
  bold,
  divider,
  tone,
}: {
  label: string;
  value: number;
  bold?: boolean;
  divider?: boolean;
  tone?: "green";
}) {
  return (
    <div className={`flex justify-between ${divider ? "border-t border-gray-100 dark:border-neutral-800 pt-2" : ""}`}>
      <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">{label}</span>
      <span
        className={`${bold ? "font-semibold" : "font-medium"} ${
          tone === "green" ? "text-green-700" : "text-gray-900 dark:text-white"
        }`}
      >
        ₹{value.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

// Emergency-fund health indicator: ✅ once the target is fully covered,
// otherwise a colored dot + percent — blue once you're past the halfway
// mark, gray below it, so the table reads at a glance without opening
// anything.
function MilestoneStatus({ reached, percent }: { reached: boolean; percent: number }) {
  if (reached) {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-green-700">
        ✅ Reached
      </span>
    );
  }

  const isHalfway = percent >= 50;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${
        isHalfway ? "text-blue-700" : "text-gray-500 dark:text-gray-400 dark:text-gray-500"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isHalfway ? "bg-blue-500" : "bg-gray-300"}`} />
      {percent.toFixed(0)}%
    </span>
  );
}