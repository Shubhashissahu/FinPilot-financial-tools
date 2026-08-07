"use client";

import { useState } from "react";
import { calculateFd, FdResult } from "@/lib/fdCalculator";
import { generateFdPdf } from "@/lib/generateFdPdf";
// import PieChart from "@/components/PieChart";

export default function FdCalculatorPage() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState<FdResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatWithCommas = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, "");
    if (!digitsOnly) return "";
    return Number(digitsOnly).toLocaleString("en-IN");
  };

  const handleCalculate = () => {
    const p = Number(principal.replace(/,/g, ""));
    const r = Number(rate);
    const t = Number(tenure);

    if (!p || p <= 0) {
      setError("Enter a valid principal amount.");
      setResult(null);
      return;
    }
    if (!r || r <= 0) {
      setError("Enter a valid interest rate.");
      setResult(null);
      return;
    }
    if (!t || t <= 0) {
      setError("Enter a valid tenure in years.");
      setResult(null);
      return;
    }

    setError("");
    setResult(calculateFd(p, r, t));
  };

  const shareText = result
    ? `FD Calculation\n\nPrincipal: ₹${result.principal.toLocaleString("en-IN")}\nMaturity Value: ₹${result.maturityValue.toLocaleString("en-IN")}\nTotal Interest: ₹${result.totalInterest.toLocaleString("en-IN")}\nEffective Annual Yield: ${result.effectiveAnnualYield}%\n\nCalculated with SplitEasy`
    : "";

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
    <main className="min-h-screen bg-green-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-4xl font-black text-green-700">
          FD Calculator
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Calculate your Fixed Deposit maturity value, compounded quarterly.
        </p>

        <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Principal Amount (₹)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={principal}
                onChange={(e) => setPrincipal(formatWithCommas(e.target.value))}
                placeholder="e.g. 1,00,000"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                min={0}
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 7.1"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Tenure (Years)
            </label>
            <input
              type="number"
              min={1}
              step="0.5"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="e.g. 5"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleCalculate}
            className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Calculate FD
          </button>
        </section>

        {result && (
          <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <SummaryRow label="Maturity Value" value={result.maturityValue} highlight />
              <SummaryRow label="Total Interest Earned" value={result.totalInterest} />
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              Effective annual yield:{" "}
              <span className="font-semibold text-gray-900">
                {result.effectiveAnnualYield}%
              </span>{" "}
              (higher than the nominal rate due to quarterly compounding)
            </div>

            <div className="mt-8 flex justify-center">
              {/* <PieChart principal={result.principal} interest={result.totalInterest} /> */}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => generateFdPdf(result, Number(rate), Number(tenure))}
                className="rounded-lg border border-green-600 px-6 py-3 font-medium text-green-700 transition hover:bg-green-50"
              >
                Download PDF
              </button>
              <button
                onClick={handleShare}
                className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
              >
                {copied ? "Copied ✓" : "Share"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? "bg-green-50" : "bg-gray-50"}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-green-700" : "text-gray-900"}`}>
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}