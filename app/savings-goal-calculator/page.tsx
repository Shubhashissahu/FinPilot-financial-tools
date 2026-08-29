"use client";

import { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import BackButton from "@/components/BackButton";
import { calculateSavingsGoal, GoalMode } from "@/lib/calculators/savingsGoal";

const GOAL_PRESETS = [
  { label: "Emergency Fund", icon: "🛡️", amount: 300000 },
  { label: "Vacation", icon: "✈️", amount: 50000 },
  { label: "Bike", icon: "🏍️", amount: 150000 },
  { label: "House Down Payment", icon: "🏠", amount: 2000000 },
  { label: "Custom", icon: "🎯", amount: 500000 },
];

function formatCompact(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function SavingsGoalPage() {
  const [activePreset, setActivePreset] = useState("Custom");
  const [targetInput, setTargetInput] = useState("5,00,000");
  const [mode, setMode] = useState<GoalMode>("byMonthlyContribution");
  const [contributionInput, setContributionInput] = useState("11,000");
  const [targetMonthsInput, setTargetMonthsInput] = useState("18");
  const [interestRate, setInterestRate] = useState(7);

  const num = (v: string) => Number(v.replace(/,/g, "")) || 0;
  const formatWithCommas = (raw: string, setter: (v: string) => void) => {
    const digits = raw.replace(/[^\d]/g, "");
    setter(digits ? Number(digits).toLocaleString("en-IN") : "");
  };

  const targetAmount = num(targetInput);

  const result = useMemo(
    () =>
      calculateSavingsGoal({
        targetAmount,
        annualInterestRate: interestRate,
        mode,
        monthlyContribution: num(contributionInput),
        targetMonths: num(targetMonthsInput),
      }),
    [targetAmount, interestRate, mode, contributionInput, targetMonthsInput]
  );

  const handlePresetClick = (preset: typeof GOAL_PRESETS[0]) => {
    setActivePreset(preset.label);
    setTargetInput(preset.amount.toLocaleString("en-IN"));
  };

  const monthsForDisplay = mode === "byMonthlyContribution" ? result.monthsRequired : num(targetMonthsInput);
  const years = monthsForDisplay ? Math.floor(monthsForDisplay / 12) : 0;
  const months = monthsForDisplay ? monthsForDisplay % 12 : 0;
  let timeString = "";
  if (years > 0) timeString += `${years} year${years > 1 ? "s" : ""} `;
  if (months > 0 || years === 0) timeString += `${months} month${months > 1 ? "s" : ""}`;

  return (
    <main className="min-h-screen bg-[#F7FAF8] dark:bg-[#0a0a0a] px-4 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <BackButton />
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Savings Goal Calculator</h1>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Figure out how much to save each month — or how long it will take at your current pace.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {GOAL_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                activePreset === preset.label
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-2xs"
                  : "border-slate-200/80 bg-white text-slate-700 hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-300 dark:hover:border-neutral-700"
              }`}
            >
              <span>{preset.icon}</span>
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Goal</h2>
            <div className="mt-2 border-t border-gray-100 dark:border-neutral-800" />

            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Target Goal Amount (₹)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={targetInput}
                onChange={(e) => {
                  formatWithCommas(e.target.value, setTargetInput);
                  setActivePreset("Custom");
                }}
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div className="mt-6 flex gap-2 rounded-xl bg-gray-100 dark:bg-neutral-800 p-1">
              <button
                onClick={() => setMode("byMonthlyContribution")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${mode === "byMonthlyContribution"
                    ? "bg-white dark:bg-neutral-700 text-green-700 dark:text-green-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                I know my monthly budget
              </button>
              <button
                onClick={() => setMode("byDeadline")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${mode === "byDeadline"
                    ? "bg-white dark:bg-neutral-700 text-green-700 dark:text-green-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                I know my deadline
              </button>
            </div>

            {mode === "byMonthlyContribution" ? (
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  How much can you save per month? (₹)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={contributionInput}
                  onChange={(e) => formatWithCommas(e.target.value, setContributionInput)}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                />
              </div>
            ) : (
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  I want this in how many months?
                </label>
                <input
                  type="number"
                  min={1}
                  value={targetMonthsInput}
                  onChange={(e) => setTargetMonthsInput(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                />
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Expected Return Rate (p.a.)
                </label>
                <span className="text-sm font-bold text-green-700">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-3 w-full accent-green-600"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>20%</span>
              </div>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                0% = Cash/Bank, 7% = FD/RD, 10%+ = Equity/Mutual Funds
              </p>
              {interestRate >= 10 && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  ⚠️ Market-linked returns above ~8-9% aren&apos;t guaranteed — this projection assumes a
                  consistent rate that real equity/mutual fund investments don&apos;t provide year to year.
                </p>
              )}
            </div>
          </section>

          <div className="space-y-6">
            {mode === "byMonthlyContribution" && result.exceedsMaxTimeframe ? (
              <div className="rounded-2xl p-6 bg-amber-500 text-white shadow-lg text-center">
                <p className="text-sm font-medium uppercase tracking-wider">Time to reach your goal</p>
                <p className="mt-2 text-3xl font-black">100+ years</p>
                <p className="mt-2 text-sm">
                  At this contribution rate, this goal isn&apos;t realistically reachable — try increasing
                  your monthly savings or return rate.
                </p>
              </div>
            ) : mode === "byMonthlyContribution" ? (
              <div className="rounded-2xl p-6 bg-green-600 dark:bg-green-700 text-white shadow-lg shadow-green-600/20 text-center">
                <p className="text-sm font-medium text-green-100 uppercase tracking-wider">
                  Time to reach your goal
                </p>
                <p className="mt-2 text-4xl font-black">{timeString}</p>
                <p className="mt-2 text-sm text-green-100">({result.monthsRequired} months total)</p>
              </div>
            ) : (
              <div className="rounded-2xl p-6 bg-green-600 dark:bg-green-700 text-white shadow-lg shadow-green-600/20 text-center">
                <p className="text-sm font-medium text-green-100 uppercase tracking-wider">
                  You need to save
                </p>
                <p className="mt-2 text-4xl font-black">
                  ₹{result.requiredMonthlyContribution?.toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-sm text-green-100">per month, for {targetMonthsInput} months</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total Saved" value={result.totalPrincipal} tone="blue" />
              <StatCard label="Interest Earned" value={result.totalInterest} tone="amber" />
            </div>

            <section className="rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm border border-gray-100 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Summary</h2>
              <div className="mt-2 divide-y divide-gray-100 dark:divide-neutral-800 border-t border-gray-100 dark:border-neutral-800">
                <SummaryLine label="Target Amount" value={`₹${targetAmount.toLocaleString("en-IN")}`} highlight />
                <SummaryLine
                  label="Monthly Contribution"
                  value={`₹${(mode === "byMonthlyContribution" ? num(contributionInput) : result.requiredMonthlyContribution ?? 0).toLocaleString("en-IN")}`}
                />
                <SummaryLine
                  label="Final Balance"
                  value={`₹${(result.totalPrincipal + result.totalInterest).toLocaleString("en-IN")}`}
                />
              </div>
            </section>
          </div>
        </div>

        {result.yearlyData.length > 0 && (
          <section className="mt-6 rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm border border-gray-100 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Growth Over Time (₹)</h2>
            <div className="mt-2 border-t border-gray-100 dark:border-neutral-800 mb-6" />
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#9ca3af" tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis stroke="#9ca3af" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <Tooltip
                    formatter={(value: unknown) => [`₹${Number(value).toLocaleString("en-IN")}`, undefined]}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px' }}
                    itemStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="principal" 
                    name="Amount Saved" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="url(#colorPrincipal)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interest" 
                    name="Interest Earned" 
                    stackId="1" 
                    stroke="#f59e0b" 
                    fill="url(#colorInterest)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "blue" | "amber" | "green" }) {
  const styles = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", label: "text-blue-700 dark:text-blue-300", value: "text-blue-700 dark:text-blue-300" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", label: "text-amber-700 dark:text-amber-300", value: "text-amber-600 dark:text-amber-300" },
    green: { bg: "bg-green-50 dark:bg-green-900/20", label: "text-green-700 dark:text-green-400", value: "text-green-700 dark:text-green-400" },
  }[tone];

  return (
    <div className={`rounded-2xl p-4 ${styles.bg}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${styles.label}`}>
        {label}
      </p>
      <p className={`mt-1 text-xl font-black ${styles.value}`}>
        ₹{Math.round(value).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-3 px-2 -mx-2 rounded-lg ${highlight ? "bg-green-50 dark:bg-green-900/10" : ""}`}>
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-bold ${highlight ? "text-green-700 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
        {value}
      </span>
    </div>
  );
}