"use client";

import { useMemo, useState } from "react";
import { calculatePrepayment } from "@/lib/calculators/prepayment";
import { FaqAccordion } from "@/components/prepayment-calculator/FaqAccordion";
import Link from "next/link";

const MIN_AMOUNT = 100000;
const MAX_AMOUNT = 50000000; // ₹5Cr
const MIN_RATE = 5;
const MAX_RATE = 20;
const MIN_TENURE = 1;
const MAX_TENURE = 30;

function formatCompact(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function PrepaymentCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(2500000); // 25L
  const [interestRate, setInterestRate] = useState(9.0);
  const [tenureYears, setTenureYears] = useState(15);
  const [lumpSum, setLumpSum] = useState(0);
  const [recurringExtra, setRecurringExtra] = useState(0);
  const [strategy, setStrategy] = useState<"reduce-tenure" | "reduce-emi">("reduce-tenure");

  const result = useMemo(
    () => calculatePrepayment(loanAmount, interestRate, tenureYears * 12, lumpSum, recurringExtra, strategy),
    [loanAmount, interestRate, tenureYears, lumpSum, recurringExtra, strategy]
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900/50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-green-700 hover:underline dark:text-green-500">
            ← Back to tools
          </Link>
        </div>
        <h1 className="text-center text-4xl font-black text-green-700">
          Loan Prepayment Calculator
        </h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          See how extra payments reduce your loan tenure and save interest.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Loan details card */}
          <section className="rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Current Loan Details</h2>
            <div className="mt-2 border-t border-gray-100 dark:border-neutral-800" />

            <SliderField
              label="Outstanding Loan Balance"
              value={loanAmount}
              display={formatCompact(loanAmount)}
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={100000}
              minLabel="₹1L"
              maxLabel="₹5Cr"
              onChange={(val) => {
                setLoanAmount(val);
                if (lumpSum > val) setLumpSum(val);
              }}
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
              label="Remaining Tenure"
              value={tenureYears}
              display={`${tenureYears} ${tenureYears === 1 ? "year" : "years"}`}
              min={MIN_TENURE}
              max={MAX_TENURE}
              step={1}
              minLabel="1 yr"
              maxLabel="30 yrs"
              onChange={setTenureYears}
            />

            <h2 className="mt-10 text-lg font-bold text-gray-900 dark:text-white">Prepayment</h2>
            <div className="mt-2 border-t border-gray-100 dark:border-neutral-800" />

            <SliderField
              label="One-Time Lump Sum Payment"
              value={lumpSum}
              display={formatCompact(lumpSum)}
              min={0}
              max={loanAmount}
              step={10000}
              minLabel="₹0"
              maxLabel="Full"
              onChange={setLumpSum}
            />

            <SliderField
              label="Extra Monthly Payment (Recurring)"
              value={recurringExtra}
              display={`₹${recurringExtra.toLocaleString("en-IN")}`}
              min={0}
              max={50000}
              step={500}
              minLabel="₹0"
              maxLabel="₹50k"
              onChange={setRecurringExtra}
            />

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Lump Sum Strategy
              </label>
              <div className="mt-3 flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-neutral-800 dark:bg-neutral-950">
                <button
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    strategy === "reduce-tenure"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  onClick={() => setStrategy("reduce-tenure")}
                >
                  Reduce Tenure
                </button>
                <button
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    strategy === "reduce-emi"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  onClick={() => setStrategy("reduce-emi")}
                >
                  Reduce EMI
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {strategy === "reduce-tenure" 
                  ? "Keep your EMI the same, but finish your loan earlier to save maximum interest." 
                  : "Reduce your monthly EMI burden, but keep the loan running for the same total duration."}
              </p>
            </div>
          </section>

          {/* Results */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Interest Saved" value={result.interestSaved} tone="green" />
              <div className="rounded-2xl p-4 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  Time Saved
                </p>
                <p className="mt-1 text-xl font-black text-blue-700 dark:text-blue-300">
                  {Math.floor(result.tenureSavedMonths / 12)}y {result.tenureSavedMonths % 12}m
                </p>
              </div>
            </div>

            <section className="rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Summary</h2>
              <div className="mt-2 divide-y divide-gray-100 border-t border-gray-100 dark:border-neutral-800">
                <SummaryLine 
                  label="Original EMI" 
                  value={`₹${result.originalEmi.toLocaleString("en-IN")}`} 
                />
                <SummaryLine 
                  label="New EMI (Base)" 
                  value={`₹${result.newEmi.toLocaleString("en-IN")}`} 
                  highlight={strategy === "reduce-emi" && result.newEmi < result.originalEmi}
                />
                {recurringExtra > 0 && (
                  <SummaryLine 
                    label="Total Monthly Outflow" 
                    value={`₹${(result.newEmi + recurringExtra).toLocaleString("en-IN")}`}
                  />
                )}
                
                <div className="py-2" />
                
                <SummaryLine 
                  label="Original Interest" 
                  value={`₹${result.originalTotalInterest.toLocaleString("en-IN")}`} 
                />
                <SummaryLine 
                  label="New Total Interest" 
                  value={`₹${result.newTotalInterest.toLocaleString("en-IN")}`} 
                  highlight={result.interestSaved > 0}
                />
              </div>
            </section>
          </div>
        </div>
        
        {/* FAQ / Understanding section */}
        <FaqAccordion />
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
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
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
    green: { bg: "bg-green-50 dark:bg-green-900/20", label: "text-green-700 dark:text-green-400", value: "text-green-700 dark:text-green-400" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", label: "text-amber-700 dark:text-amber-300", value: "text-amber-600 dark:text-amber-300" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", label: "text-blue-700 dark:text-blue-300", value: "text-blue-700 dark:text-blue-300" },
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
