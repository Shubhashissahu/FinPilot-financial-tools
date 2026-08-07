"use client";

import { useMemo, useState } from "react";
import { calculateEmi } from "@/lib/emiCalculator";
import { generateEmiPdf } from "@/lib/generateEmiPdf";

const MIN_AMOUNT = 100000; // ₹1L
const MAX_AMOUNT = 10000000; // ₹1Cr
const MIN_RATE = 5;
const MAX_RATE = 20;
const MIN_TENURE = 1;
const MAX_TENURE = 30;

function formatCompact(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

type YearRow = {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
};

// Builds a reducing-balance amortization schedule from the same inputs
// used for the headline EMI, then rolls the 12 monthly rows for each
// year into a single summary row — this keeps the table matching the
// live sliders instead of drifting from a separately-computed schedule.
function buildYearlySchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  monthlyEmi: number
): YearRow[] {
  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  const rows: YearRow[] = [];

  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestForMonth = balance * monthlyRate;
    let principalForMonth = monthlyEmi - interestForMonth;

    // Guard the last installment against floating-point drift so the
    // balance lands on exactly zero instead of a stray paisa amount.
    if (month === tenureMonths || principalForMonth > balance) {
      principalForMonth = balance;
    }

    balance = Math.max(0, balance - principalForMonth);
    yearPrincipal += principalForMonth;
    yearInterest += interestForMonth;

    if (month % 12 === 0 || month === tenureMonths) {
      rows.push({
        year: rows.length + 1,
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        balance: Math.round(balance),
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  return rows;
}

export default function EmiCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(1);
  const [copied, setCopied] = useState(false);

  // Live calculation — no submit button, every slider drag recomputes.
  const result = useMemo(
    () => calculateEmi(loanAmount, interestRate, tenureYears * 12),
    [loanAmount, interestRate, tenureYears]
  );

  const schedule = useMemo(
    () =>
      buildYearlySchedule(loanAmount, interestRate, tenureYears * 12, result.monthlyEmi),
    [loanAmount, interestRate, tenureYears, result.monthlyEmi]
  );

  const interestRatio = result.principal > 0
    ? ((result.totalInterest / result.principal) * 100).toFixed(1)
    : "0.0";

  const shareText = `EMI Calculation\n\nLoan Amount: ₹${result.principal.toLocaleString("en-IN")}\nMonthly EMI: ₹${result.monthlyEmi.toLocaleString("en-IN")}\nYearly Payment: ₹${result.yearlyPayment.toLocaleString("en-IN")}\nTotal Interest: ₹${result.totalInterest.toLocaleString("en-IN")}\nTotal Payment: ₹${result.totalPayment.toLocaleString("en-IN")}\n\nCalculated with SplitEasy`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-4xl font-black text-green-700">
          EMI Calculator
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Drag the sliders to see your EMI update instantly.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Loan details card */}
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Loan details</h2>
            <div className="mt-2 border-t border-gray-100" />

            <SliderField
              label="Loan amount"
              value={loanAmount}
              display={formatCompact(loanAmount)}
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={10000}
              minLabel="₹1L"
              maxLabel="₹1Cr"
              onChange={setLoanAmount}
            />

            <SliderField
              label="Interest rate (per annum)"
              value={interestRate}
              display={`${interestRate}%`}
              min={MIN_RATE}
              max={MAX_RATE}
              step={0.1}
              minLabel="5%"
              maxLabel="20%"
              onChange={setInterestRate}
            />

            <SliderField
              label="Loan tenure"
              value={tenureYears}
              display={`${tenureYears} ${tenureYears === 1 ? "year" : "years"}`}
              min={MIN_TENURE}
              max={MAX_TENURE}
              step={1}
              minLabel="1 yr"
              maxLabel="30 yrs"
              onChange={setTenureYears}
            />
          </section>

          {/* Results */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Monthly EMI" value={result.monthlyEmi} tone="green" />
              <StatCard label="Total Interest" value={result.totalInterest} tone="amber" />
              <StatCard label="Total Payment" value={result.totalPayment} tone="blue" />
            </div>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Summary</h2>
              <div className="mt-2 divide-y divide-gray-100 border-t border-gray-100">
                <SummaryLine label="Principal" value={`₹${result.principal.toLocaleString("en-IN")}`} />
                <SummaryLine label="Total interest" value={`₹${result.totalInterest.toLocaleString("en-IN")}`} />
                <SummaryLine
                  label="Total amount payable"
                  value={`₹${result.totalPayment.toLocaleString("en-IN")}`}
                  highlight
                />
                <SummaryLine label="Interest ratio" value={`${interestRatio}%`} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => generateEmiPdf(result, interestRate)}
                  className="flex-1 rounded-lg border border-green-600 px-4 py-3 text-sm font-medium text-green-700 transition hover:bg-green-50"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  {copied ? "Copied ✓" : "Share"}
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Amortization schedule */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Amortization schedule</h2>
          <div className="mt-2 border-t border-gray-100" />

          <div className="mt-2 max-h-[420px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100 text-left">
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Year
                  </th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Principal (₹)
                  </th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Interest (₹)
                  </th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Balance (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.year} className="border-b border-gray-50">
                    <td className="py-3 text-gray-700">Year {row.year}</td>
                    <td className="py-3 text-right font-semibold text-green-600">
                      {row.principalPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right font-semibold text-amber-600">
                      {row.interestPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-900">
                      {row.balance.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function SliderField({
  label,
  value,
  display,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-6 first:mt-6">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
        <span className="text-sm font-bold text-green-700">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-green-600"
      />
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "amber" | "blue";
}) {
  const styles = {
    green: { bg: "bg-green-50", label: "text-green-700", value: "text-green-700" },
    amber: { bg: "bg-amber-50", label: "text-amber-700", value: "text-amber-600" },
    blue: { bg: "bg-blue-50", label: "text-blue-700", value: "text-blue-700" },
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
    <div className={`flex items-center justify-between py-3 px-2 -mx-2 rounded-lg ${highlight ? "bg-green-50" : ""}`}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-bold ${highlight ? "text-green-700" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}