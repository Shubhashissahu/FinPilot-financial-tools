//app/tax-calculator/page.tsx
"use client";

import { useState } from "react";
import { compareTax, TaxResult } from "@/lib/taxCalculator";

export default function TaxCalculatorPage() {
  const [incomeInput, setIncomeInput] = useState("");
  const [result, setResult] = useState<{
    fy2024_25: TaxResult;
    fy2026_27: TaxResult;
  } | null>(null);
  const [error, setError] = useState("");

  const handleIncomeChange = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, "");
    if (!digitsOnly) {
      setIncomeInput("");
      return;
    }
    const numeric = Number(digitsOnly);
    setIncomeInput(numeric.toLocaleString("en-IN"));
  };

  const handleCalculate = () => {
    const income = Number(incomeInput.replace(/,/g, ""));
    if (!incomeInput || !Number.isFinite(income) || income <= 0) {
      setError("Enter a valid annual income.");
      setResult(null);
      return;
    }
    setError("");
    setResult(compareTax(income));
  };

  const savings = result ? result.fy2024_25.totalTax - result.fy2026_27.totalTax : 0;

  return (
    <main className="min-h-screen bg-blue-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-4xl font-black text-blue-700">
          Income Tax Changes for Tax Year 2026-27
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Budget 2026 kept the new-regime slabs, rebate, standard deduction, and
          marginal relief unchanged. Compare FY 2024-25 with the current Tax
          Year 2026-27 rules.
        </p>

        <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            🧮 Tax Calculator
          </h2>

          <label className="mt-6 block text-sm font-medium text-gray-700">
            Annual Income (₹)
          </label>
          <div className="mt-2 flex gap-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter your annual income"
              value={incomeInput}
              onChange={(e) => handleIncomeChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={handleCalculate}
              className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Calculate Tax
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </section>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <SlabReferenceCard
            title="FY 2024-25"
            rows={[
              { range: "Up to 3,00,000", rate: "Nil" },
              { range: "3,00,001 - 7,00,000", rate: "5%" },
              { range: "7,00,001 - 10,00,000", rate: "10%" },
              { range: "10,00,001 - 12,00,000", rate: "15%" },
              { range: "12,00,001 - 15,00,000", rate: "20%" },
              { range: "Above 15,00,000", rate: "30%" },
            ]}
            features={[
              "Standard Deduction: ₹75,000",
              "Rebate up to ₹7,00,000 taxable income",
              "Marginal relief above ₹7L taxable income",
              "Salaried zero-tax income: ₹7,75,000",
            ]}
          />
          <SlabReferenceCard
            title="Tax Year 2026-27"
            rows={[
              { range: "Up to 4,00,000", rate: "Nil" },
              { range: "4,00,001 - 8,00,000", rate: "5%" },
              { range: "8,00,001 - 12,00,000", rate: "10%" },
              { range: "12,00,001 - 16,00,000", rate: "15%" },
              { range: "16,00,001 - 20,00,000", rate: "20%" },
              { range: "20,00,001 - 24,00,000", rate: "25%" },
              { range: "Above 24,00,000", rate: "30%" },
            ]}
            features={[
              "Standard Deduction: ₹75,000",
              "Rebate up to ₹12,00,000 taxable income",
              "Marginal relief above ₹12L taxable income",
              "Salaried zero-tax income: ₹12,75,000",
            ]}
          />
        </div>

        {result && (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <TaxCard title="FY 2024-25 Tax Calculation" result={result.fy2024_25} tone="gray" />
              <TaxCard title="Current Tax Year 2026-27 Calculation" result={result.fy2026_27} tone="blue" />
            </div>

            <div className="mt-6 rounded-2xl bg-green-50 p-6">
              <h3 className="text-lg font-bold text-gray-900">Your Tax Savings</h3>
              <p className="mt-2 text-gray-700">
                Compared with FY 2024-25 new-regime rules, the current rules
                make you{" "}
                {savings >= 0 ? (
                  <span className="font-semibold text-green-600">
                    save ₹{savings.toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="font-semibold text-red-600">
                    pay ₹{Math.abs(savings).toLocaleString("en-IN")} more
                  </span>
                )}
              </p>
            </div>
          </>
        )}

        <p className="mt-10 text-center text-xs text-gray-400">
          This calculator covers the New Tax Regime only and is for
          informational purposes — not tax advice. Verify against the
          official Income Tax Department resources before filing.
        </p>
      </div>
    </main>
  );
}

function TaxCard({
  title,
  result,
  tone,
}: {
  title: string;
  result: TaxResult;
  tone: "gray" | "blue";
}) {
  return (
    <div
      className={`rounded-2xl p-6 ${
        tone === "blue" ? "bg-blue-50" : "bg-gray-50"
      }`}
    >
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Tax:</span>
          <span className="font-semibold text-gray-900">
            ₹{result.totalTax.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Effective Tax Rate:</span>
          <span className="font-semibold text-gray-900">
            {result.effectiveRate.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Net Income:</span>
          <span className="font-semibold text-green-600">
            ₹{result.netIncome.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700">Tax Breakdown:</p>
        <div className="mt-2 rounded-lg bg-white p-3">
          {result.breakdown.length === 0 ? (
            <p className="text-sm text-gray-400">No tax applicable</p>
          ) : (
            result.breakdown.map((row, i) => (
              <div key={i} className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">{row.label}</span>
                <span
                  className={`font-medium ${
                    row.amount < 0 ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  {row.amount < 0 ? "-" : ""}₹
                  {Math.abs(row.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SlabReferenceCard({
  title,
  rows,
  features,
}: {
  title: string;
  rows: { range: string; rate: string }[];
  features: string[];
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>

      <h4 className="mt-4 text-sm font-semibold text-gray-700">Tax Slabs</h4>
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Income Range (₹)
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Tax Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                <td className="px-4 py-2 text-gray-700">{row.range}</td>
                <td className="px-4 py-2 font-medium text-green-700">{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="mt-6 text-sm font-semibold text-gray-700">Key Features</h4>
      <ul className="mt-2 space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="mt-0.5 text-green-600">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}