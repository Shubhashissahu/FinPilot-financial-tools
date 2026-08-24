"use client";

import { useMemo, useState } from "react";
import { calculateFd } from "@/lib/calculators/fd";
import { generateFdPdf } from "@/lib/pdf/FdPdf";
import BackButton from "@/components/BackButton";

const MIN_PRINCIPAL = 1000;
const MAX_PRINCIPAL = 5000000; // ₹50L
const MIN_RATE = 3;
const MAX_RATE = 10;
const MIN_TENURE = 1;
const MAX_TENURE = 10;
const TDS_THRESHOLD = 40000;
const TDS_RATE = 0.1;

type CompoundingFrequency = "monthly" | "quarterly" | "semi-annual";

const FREQUENCY_N: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "semi-annual": 2,
};

const FREQUENCY_LABEL: Record<CompoundingFrequency, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  "semi-annual": "Semi-annual",
};

function formatCompact(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function FdCalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.0);
  const [tenureYears, setTenureYears] = useState(3);
  const [frequency, setFrequency] = useState<CompoundingFrequency>("quarterly");
  const [copied, setCopied] = useState(false);

  // Source of truth stays lib/fdCalculator.ts — only TDS/net figures are
  // derived here, on top of the gross values it returns.
  const fd = useMemo(
    () => calculateFd(principal, rate, tenureYears, FREQUENCY_N[frequency]),
    [principal, rate, tenureYears, frequency]
  );

  const tds = fd.totalInterest > TDS_THRESHOLD ? fd.totalInterest * TDS_RATE : 0;
  const netInterest = fd.totalInterest - tds;
  const netMaturity = fd.principal + netInterest;

  const interestShare = netMaturity > 0 ? (netInterest / netMaturity) * 100 : 0;

  const shareText = `FD Calculation\n\nPrincipal: ₹${fd.principal.toLocaleString("en-IN")}\nMaturity Value: ₹${Math.round(netMaturity).toLocaleString("en-IN")}\nNet Interest: ₹${Math.round(netInterest).toLocaleString("en-IN")}\nEffective Annual Yield: ${fd.effectiveAnnualYield}%\n\nCalculated by Finpilot`;

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
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900/50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <BackButton />
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">FD Calculator</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Fixed Deposit maturity &amp; interest calculator
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* FD details card */}
          <section className="rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">FD details</h2>
            <div className="mt-2 border-t border-gray-100 dark:border-neutral-800" />

            <SliderField
              label="Principal amount"
              value={principal}
              display={formatCompact(principal)}
              min={MIN_PRINCIPAL}
              max={MAX_PRINCIPAL}
              step={1000}
              minLabel="₹1,000"
              maxLabel="₹50L"
              onChange={setPrincipal}
            />

            <SliderField
              label="Interest rate"
              value={rate}
              display={`${rate.toFixed(1)}% p.a.`}
              min={MIN_RATE}
              max={MAX_RATE}
              step={0.1}
              minLabel="3%"
              maxLabel="10%"
              onChange={setRate}
            />

            <SliderField
              label="Tenure"
              value={tenureYears}
              display={`${tenureYears} ${tenureYears === 1 ? "year" : "years"}`}
              min={MIN_TENURE}
              max={MAX_TENURE}
              step={1}
              minLabel="1 yr"
              maxLabel="10 yrs"
              onChange={setTenureYears}
            />

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Compounding frequency
              </label>
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-gray-100 dark:bg-neutral-800 p-1">
                {(Object.keys(FREQUENCY_N) as CompoundingFrequency[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setFrequency(freq)}
                    className={`rounded-md py-2 text-sm font-medium transition ${
                      frequency === freq
                        ? "bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {FREQUENCY_LABEL[freq]}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Results */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Invested" value={fd.principal} tone="blue" />
              <StatCard label="Interest" value={fd.totalInterest} tone="amber" />
              <StatCard label="Maturity" value={netMaturity} tone="green" compact />
            </div>

            <section className="rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Maturity breakdown</h2>
              <div className="mt-2 divide-y divide-gray-100 border-t border-gray-100 dark:border-neutral-800">
                <SummaryLine label="Principal" value={`₹${fd.principal.toLocaleString("en-IN")}`} />
                <SummaryLine
                  label="Total interest earned"
                  value={`₹${fd.totalInterest.toLocaleString("en-IN")}`}
                />
                <SummaryLine
                  label="TDS (10% if int > ₹40k)"
                  value={`−₹${Math.round(tds).toLocaleString("en-IN")}`}
                />
                <SummaryLine label="Net interest" value={`₹${Math.round(netInterest).toLocaleString("en-IN")}`} />
                <SummaryLine
                  label="Maturity amount"
                  value={`₹${Math.round(netMaturity).toLocaleString("en-IN")}`}
                  highlight
                />
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 dark:bg-neutral-900/50 p-4 text-sm text-gray-600 dark:text-gray-400">
                Effective annual yield:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {fd.effectiveAnnualYield}%
                </span>{" "}
                ({FREQUENCY_LABEL[frequency].toLowerCase()} compounding)
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => generateFdPdf(fd, rate, tenureYears, FREQUENCY_LABEL[frequency].toLowerCase())}
                  suppressHydrationWarning
                  className="flex-1 rounded-lg border border-green-600 px-4 py-3 text-sm font-medium text-green-700 transition hover:bg-green-50 dark:bg-[#0a0a0a]"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleShare}
                  suppressHydrationWarning
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  {copied ? "Copied ✓" : "Share"}
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Pie chart */}
        <section className="mt-6 rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Principal vs. interest</h2>
          <div className="mt-2 border-t border-gray-100 dark:border-neutral-800" />
          <div className="mt-8 flex flex-col items-center gap-10 lg:flex-row lg:justify-center">
            <PrincipalInterestPie principalShare={100 - interestShare} interestShare={interestShare} />
            <div className="flex w-full flex-col gap-4 sm:w-[360px]">
              <LegendCard color="#2563eb" label="Total Principal" value={`₹${fd.principal.toLocaleString("en-IN")}`} percentage={100 - interestShare} />
              <LegendCard color="#16a34a" label="Net Interest" value={`₹${Math.round(netInterest).toLocaleString("en-IN")}`} percentage={interestShare} />
            </div>
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
  compact,
}: {
  label: string;
  value: number;
  tone: "green" | "amber" | "blue";
  compact?: boolean;
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
        {compact ? formatCompact(value) : `₹${Math.round(value).toLocaleString("en-IN")}`}
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

// Lightweight inline SVG donut chart — avoids pulling in a charting
// library for a single two-slice visual.
function PrincipalInterestPie({
  principalShare,
  interestShare,
}: {
  principalShare: number;
  interestShare: number;
}) {
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  
  // Create a small gap between slices if both exist
  const gap = interestShare > 0 && principalShare > 0 ? 3 : 0;
  const pLen = Math.max(0, (principalShare / 100) * circumference - gap);
  const iLen = Math.max(0, (interestShare / 100) * circumference - gap);

  return (
    <div className="relative flex h-[180px] w-[180px] shrink-0 items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180" className="absolute inset-0 -rotate-90 transform">
        <circle 
          cx="90" cy="90" r={radius} fill="none" 
          className="stroke-gray-100 dark:stroke-neutral-800" 
          strokeWidth="16" 
        />
        <circle
          cx="90" cy="90" r={radius} fill="none" stroke="#2563eb" strokeWidth="16"
          strokeDasharray={`${pLen} ${circumference}`}
          strokeDashoffset="0"
          className="transition-all duration-500 ease-in-out"
        />
        <circle
          cx="90" cy="90" r={radius} fill="none" stroke="#16a34a" strokeWidth="16"
          strokeDasharray={`${iLen} ${circumference}`}
          strokeDashoffset={-((principalShare / 100) * circumference)}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-black text-gray-900 dark:text-white">
          {interestShare.toFixed(1)}%
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Interest
        </span>
      </div>
    </div>
  );
}

function LegendCard({ color, label, value, percentage }: { color: string; label: string; value: string; percentage: number }) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50 p-4">
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-black text-gray-900 dark:text-white">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}