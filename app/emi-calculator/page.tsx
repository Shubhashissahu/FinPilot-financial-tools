"use client";

import { useState } from "react";
import { calculateEmi, EmiResult } from "@/lib/emiCalculator";
import { generateEmiPdf } from "@/lib/generateEmiPdf";
// import PieChart from "@/components/PieChart";

type TenureUnit = "years" | "months";

export default function EmiCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureValue, setTenureValue] = useState("");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");
  const [result, setResult] = useState<EmiResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatWithCommas = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, "");
    if (!digitsOnly) return "";
    return Number(digitsOnly).toLocaleString("en-IN");
  };

  const handleCalculate = () => {
    const principal = Number(loanAmount.replace(/,/g, ""));
    const rate = Number(interestRate);
    const tenure = Number(tenureValue);

    if (!principal || principal <= 0) {
      setError("Enter a valid loan amount.");
      setResult(null);
      return;
    }
    if (!rate || rate <= 0) {
      setError("Enter a valid interest rate.");
      setResult(null);
      return;
    }
    if (!tenure || tenure <= 0) {
      setError("Enter a valid loan tenure.");
      setResult(null);
      return;
    }

    const tenureMonths = tenureUnit === "years" ? tenure * 12 : tenure;
    setError("");
    setResult(calculateEmi(principal, rate, tenureMonths));
  };

  const shareText = result
    ? `EMI Calculation\n\nLoan Amount: ₹${result.principal.toLocaleString("en-IN")}\nMonthly EMI: ₹${result.monthlyEmi.toLocaleString("en-IN")}\nYearly Payment: ₹${result.yearlyPayment.toLocaleString("en-IN")}\nTotal Interest: ₹${result.totalInterest.toLocaleString("en-IN")}\nTotal Payment: ₹${result.totalPayment.toLocaleString("en-IN")}\n\nCalculated with SplitEasy`
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
          EMI Calculator
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Calculate your monthly and yearly loan payments.
        </p>

        <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loan Amount (₹)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={loanAmount}
                onChange={(e) => setLoanAmount(formatWithCommas(e.target.value))}
                placeholder="e.g. 5,00,000"
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
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g. 8.5"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Loan Tenure
            </label>
            <div className="mt-2 flex gap-3">
              <input
                type="number"
                min={1}
                value={tenureValue}
                onChange={(e) => setTenureValue(e.target.value)}
                placeholder={tenureUnit === "years" ? "e.g. 5" : "e.g. 60"}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
              <select
                value={tenureUnit}
                onChange={(e) => setTenureUnit(e.target.value as TenureUnit)}
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleCalculate}
            className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Calculate EMI
          </button>
        </section>

        {result && (
          <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <SummaryRow label="Monthly EMI" value={result.monthlyEmi} highlight />
              <SummaryRow label="Yearly Payment" value={result.yearlyPayment} />
              <SummaryRow label="Total Interest" value={result.totalInterest} />
              <SummaryRow label="Total Payment" value={result.totalPayment} />
            </div>

            <div className="mt-8 flex justify-center">
              {/* <PieChart principal={result.principal} interest={result.totalInterest} /> */}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => generateEmiPdf(result, Number(interestRate))}
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