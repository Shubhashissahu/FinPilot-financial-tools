"use client";

import { useState, useMemo } from "react";
import { calculateSip, formatLakh } from "@/lib/calculators/sip";
import BackButton from "@/components/BackButton";

export default function SipCalculatorPage() {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [returnRate, setReturnRate] = useState(8.5);
  const [duration, setDuration] = useState(15);
  const [stepUp, setStepUp] = useState(0);

  // Recompute live as sliders move — cheap enough (max 480 iterations) to
  // not need a manual "Calculate" button.
  const result = useMemo(
    () => calculateSip(monthlyAmount, returnRate, duration, stepUp),
    [monthlyAmount, returnRate, duration, stepUp]
  );

  return (
    <main className="min-h-screen bg-[#F7FAF8] dark:bg-[#0a0a0a] px-4 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <BackButton />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">SIP Calculator</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Systematic Investment Plan · Mutual Fund compounding growth estimator
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* LEFT: inputs */}
          <section className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs">
            <h2 className="font-semibold text-gray-900 dark:text-white">Investment details</h2>

            <SliderField
              label="Monthly SIP Amount"
              value={monthlyAmount}
              displayValue={`₹${monthlyAmount.toLocaleString("en-IN")}`}
              min={500}
              max={100000}
              step={500}
              minLabel="₹500"
              maxLabel="₹1L"
              onChange={setMonthlyAmount}
            />

            <SliderField
              label="Expected Return Rate"
              value={returnRate}
              displayValue={`${returnRate}% p.a.`}
              min={6}
              max={30}
              step={0.5}
              minLabel="6%"
              maxLabel="30%"
              onChange={setReturnRate}
            />

            <SliderField
              label="Investment Duration"
              value={duration}
              displayValue={`${duration} years`}
              min={1}
              max={40}
              step={1}
              minLabel="1 yr"
              maxLabel="40 yrs"
              onChange={setDuration}
            />

            <SliderField
              label="Annual Step-up"
              value={stepUp}
              displayValue={stepUp === 0 ? "0% (fixed)" : `${stepUp}%`}
              min={0}
              max={25}
              step={1}
              minLabel="0% (fixed)"
              maxLabel="25%"
              onChange={setStepUp}
            />
          </section>

          {/* RIGHT: results */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="INVESTED" value={formatLakh(result.totalInvested)} tone="blue" />
              <StatCard label="GAINS" value={formatLakh(result.totalGains)} tone="amber" />
              <StatCard label="MATURITY" value={formatLakh(result.maturityValue)} tone="green" />
            </div>

            <section className="rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 dark:text-white">Summary</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 dark:border-neutral-800 pb-3">
                  <span className="text-gray-500 dark:text-gray-400">Total invested</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{result.totalInvested.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-neutral-800 pb-3">
                  <span className="text-gray-500 dark:text-gray-400">Total gains</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{result.totalGains.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-neutral-800 pb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">Maturity value</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatLakh(result.maturityValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Wealth ratio</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.wealthRatio}×</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-green-50 dark:bg-green-900/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-500">
                The power of compounding
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                ₹{monthlyAmount.toLocaleString("en-IN")}/month for {duration} years at{" "}
                {returnRate}% grows to{" "}
                <span className="font-semibold">{formatLakh(result.maturityValue)}</span> — a
                gain of{" "}
                <span className="font-semibold">
                  {result.totalInvested > 0
                    ? Math.round((result.totalGains / result.totalInvested) * 100)
                    : 0}
                  %
                </span>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function SliderField({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  onChange,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  onChange: (val: number) => void;
}) {
  return (
    <div className="mt-6 first:mt-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-semibold text-green-600">{displayValue}</span>
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
  value: string;
  tone: "blue" | "amber" | "green";
}) {
  const toneClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
  }[tone];

  return (
    <div className={`rounded-xl p-4 ${toneClasses}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}