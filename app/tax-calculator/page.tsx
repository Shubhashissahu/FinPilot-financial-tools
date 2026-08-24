//app/tax-calculator/page.tsx
"use client";

import { useState } from "react";
import { calculateTaxForYear, TAX_YEARS, TaxResult } from "@/lib/calculators/tax";
import BackButton from "@/components/BackButton";

export default function TaxCalculatorPage() {
  const [yearId, setYearId] = useState("ty2026_27");
  const [incomeInput, setIncomeInput] = useState("");
  const [tdsInput, setTdsInput] = useState("");
  const [advanceTaxInput, setAdvanceTaxInput] = useState("");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState("");

  const formatInput = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, "");
    if (!digitsOnly) return "";
    return Number(digitsOnly).toLocaleString("en-IN");
  };

  const parseNumeric = (raw: string) => Number(raw.replace(/[^\d]/g, ""));

  const handleCalculate = () => {
    const income = parseNumeric(incomeInput);
    if (!incomeInput || !Number.isFinite(income) || income < 0) {
      setError("Enter a valid annual income.");
      setResult(null);
      return;
    }
    setError("");
    setResult(calculateTaxForYear(income, yearId));
  };

  // Re-calculate automatically if year changes while there is a result
  const handleYearChange = (newYearId: string) => {
    setYearId(newYearId);
    if (result && incomeInput) {
      setResult(calculateTaxForYear(parseNumeric(incomeInput), newYearId));
    }
  };

  const tds = parseNumeric(tdsInput) || 0;
  const advanceTax = parseNumeric(advanceTaxInput) || 0;
  
  const taxPayable = result ? result.totalTax - tds - advanceTax : 0;
  const isRefund = taxPayable < 0;

  const currentConfig = TAX_YEARS[yearId];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <BackButton />
        <h1 className="text-center text-4xl font-black text-gray-900 dark:text-white">
          New Tax Regime Calculator
        </h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Calculate your income tax liability under the new tax regime.
        </p>

        <section className="mt-10 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-neutral-800 pb-6 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              🧮 Tax Calculator
            </h2>
            <div className="flex flex-col sm:items-end">
              <label className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Tax Year</label>
              <select
                value={yearId}
                onChange={(e) => handleYearChange(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-950 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {Object.values(TAX_YEARS).map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Annual Gross Income (₹)
              </label>
              <div className="mt-2 flex gap-3 flex-col sm:flex-row">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 15,00,000"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(formatInput(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
                <button
                  onClick={handleCalculate}
                  className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Calculate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  TDS Already Paid (₹) <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 50,000"
                  value={tdsInput}
                  onChange={(e) => setTdsInput(formatInput(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Advance Tax Paid (₹) <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 10,000"
                  value={advanceTaxInput}
                  onChange={(e) => setAdvanceTaxInput(formatInput(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{error}</p>}
        </section>

        {result && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <TaxCard title="Tax Calculation" result={result} tone="gray" />

            <div className="rounded-2xl border border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tax Summary</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Tax Liability:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{result.totalTax.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">TDS Paid:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      - ₹{tds.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Advance Tax:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      - ₹{advanceTax.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-green-200 dark:border-green-900/50 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">
                    {isRefund ? "Tax Refund Due:" : "Net Tax Payable:"}
                  </span>
                  <span className={`text-2xl font-black ${isRefund ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    ₹{Math.abs(taxPayable).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <SlabReferenceCard
            title={`${currentConfig.label} Rules`}
            rows={currentConfig.slabs.map((s, i) => {
              const prev = i === 0 ? 0 : currentConfig.slabs[i - 1].upTo;
              const range = s.upTo === Infinity 
                ? `Above ${(prev).toLocaleString('en-IN')}`
                : i === 0 
                  ? `Up to ${(s.upTo).toLocaleString('en-IN')}`
                  : `${(prev + 1).toLocaleString('en-IN')} - ${(s.upTo).toLocaleString('en-IN')}`;
              const rate = s.rate === 0 ? "Nil" : `${s.rate * 100}%`;
              return { range, rate };
            })}
            features={[
              `Standard Deduction: ₹${currentConfig.standardDeduction.toLocaleString("en-IN")}`,
              `Rebate up to ₹${currentConfig.rebateThreshold.toLocaleString("en-IN")} taxable income`,
              `Maximum Section 87A rebate: ₹${currentConfig.maxRebate.toLocaleString("en-IN")}`,
              `Salaried zero-tax income: ₹${(currentConfig.rebateThreshold + currentConfig.standardDeduction).toLocaleString("en-IN")}`,
            ]}
          />
        </div>

        <div className="mt-16 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How the Indian Tax System Works</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This calculator strictly follows the <strong>New Tax Regime</strong>. Here is a visual flow of how your final tax liability is calculated:
          </p>

          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3 overflow-x-auto pb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
            <span className="whitespace-nowrap px-3 py-1.5 rounded-md bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">Gross Income</span>
            <span className="text-gray-400">→</span>
            <span className="whitespace-nowrap px-3 py-1.5 rounded-md bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">Taxable Income</span>
            <span className="text-gray-400">→</span>
            <span className="whitespace-nowrap px-3 py-1.5 rounded-md bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">Base Tax</span>
            <span className="text-gray-400">→</span>
            <span className="whitespace-nowrap px-3 py-1.5 rounded-md bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">Surcharge & Relief</span>
            <span className="text-gray-400">→</span>
            <span className="whitespace-nowrap px-3 py-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">Final Tax Liability</span>
          </div>

          <div className="mt-8 space-y-10">
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2 mb-4">1. Calculating Taxable Income</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Your taxable income depends on your income sources and any applicable adjustments. For a simple salaried individual, a standard deduction applies:
              </p>
              <div className="mt-3 rounded-lg bg-gray-50 dark:bg-neutral-950 p-4 border border-gray-200 dark:border-neutral-800 text-sm font-mono text-gray-800 dark:text-gray-300">
                Gross Salary<br/>
                − Standard Deduction (e.g. ₹75,000)<br/>
                <hr className="my-2 border-gray-300 dark:border-neutral-700" />
                = Taxable Income
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2 mb-4">2. Progressive Tax Slabs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Tax slabs are <strong>progressive</strong>. This means your entire income is not taxed at the highest rate you fall into. Instead, your income is divided into chunks, and each chunk is taxed at a specific rate. For example, if you fall into the 20% slab, only the income <em>exceeding</em> the lower slabs is taxed at 20%.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2 mb-4">3. Section 87A Rebate</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Eligible resident individuals with a total income up to a specific threshold receive a full tax rebate. 
                For example, in <strong>Tax Year 2026-27</strong>, if your taxable income is up to ₹12,00,000, you can receive a rebate of up to ₹60,000, bringing your tax to zero.
                <br/><br/>
                <em>Note: Special-rate income (like short-term capital gains) may be treated differently under tax laws and could affect actual rebate eligibility.</em>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2 mb-4">4. Marginal Relief Concepts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Marginal relief protects taxpayers from situations where earning slightly more income results in a disproportionately massive tax hike. There are two distinct types:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-5">
                <li><strong>Rebate Threshold Relief (87A):</strong> If you earn just above the ₹7L or ₹12L rebate limit, your tax liability jumps because you lose the entire rebate. Marginal relief caps your tax so you don't pay more in tax than the additional income you earned above the threshold.</li>
                <li><strong>Surcharge Threshold Relief:</strong> Surcharges apply on the entire tax amount once your income crosses ₹50L, ₹1Cr, etc. Marginal relief limits the total tax+surcharge so it doesn't exceed the tax at the threshold plus the extra income earned.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2 mb-4">5. Surcharge Rates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Under the New Tax Regime, high earners pay an additional surcharge on their calculated tax:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc pl-5">
                <li>Up to ₹50 lakh → <strong>Nil</strong></li>
                <li>₹50 lakh–₹1 crore → <strong>10%</strong></li>
                <li>₹1 crore–₹2 crore → <strong>15%</strong></li>
                <li>₹2 crore–₹5 crore → <strong>25%</strong></li>
                <li>Above ₹5 crore → <strong>25%</strong></li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2 mb-4">6. Health & Education Cess</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                A <strong>4% Health & Education Cess</strong> is mandatorily applied to your final income tax <em>plus</em> any applicable surcharge.
              </p>
            </section>

            <section className="rounded-xl bg-gray-50 dark:bg-neutral-950 p-6 border border-gray-200 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Practical Example (Tax Year 2026-27)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Here is how a zero-tax calculation works for a salaried individual earning ₹12,75,000:
              </p>
              <div className="font-mono text-sm text-gray-800 dark:text-gray-300 space-y-1">
                <div className="flex justify-between"><span>Gross Salary</span><span>₹12,75,000</span></div>
                <div className="flex justify-between text-gray-500"><span>− Standard Deduction</span><span>₹75,000</span></div>
                <div className="border-t border-gray-300 dark:border-neutral-700 my-1"></div>
                <div className="flex justify-between font-bold"><span>= Taxable Income</span><span>₹12,00,000</span></div>
                <div className="mt-4 flex justify-between"><span>Tax before rebate (via Slabs)</span><span>₹60,000</span></div>
                <div className="flex justify-between text-green-600 dark:text-green-500"><span>− Section 87A rebate</span><span>₹60,000</span></div>
                <div className="border-t border-gray-300 dark:border-neutral-700 my-1"></div>
                <div className="flex justify-between font-bold text-green-700 dark:text-green-400"><span>= Final Income Tax</span><span>₹0</span></div>
              </div>
              <p className="mt-4 text-xs text-gray-500 italic">
                * Example assumes simple salaried income. Eligibility and special-rate income can affect actual tax.
              </p>
            </section>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> This calculator is for informational purposes only and is not tax advice. 
          Actual tax liability may vary depending on income type, deductions, special-rate income, residential status, 
          and other applicable provisions. Verify calculations with the official Income Tax Department resources before filing.
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
  tone: "gray" | "green";
}) {
  return (
    <div
      className={`rounded-2xl border p-6 h-full flex flex-col ${
        tone === "green"
          ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10"
          : "border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900/50"
      }`}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>

      <div className="mt-4 space-y-3 border-t border-gray-200 dark:border-neutral-800 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Taxable Income:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{result.taxableIncome.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Effective Tax Rate:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {result.effectiveRate.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Net Income:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            ₹{result.netIncome.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax Breakdown:</p>
        <div className={`mt-2 rounded-lg p-3 ${tone === 'green' ? 'bg-white dark:bg-neutral-900/50' : 'bg-white dark:bg-neutral-950'}`}>
          {result.breakdown.length === 0 ? (
            <p className="text-sm text-gray-400">No tax applicable</p>
          ) : (
            result.breakdown.map((row, i) => (
              <div key={i} className="flex justify-between py-1 text-sm">
                <span className="text-gray-600 dark:text-gray-400">{row.label}</span>
                <span
                  className={`font-medium ${
                    row.amount < 0 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
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
    <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tax Slabs</h4>
          <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-900/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    Income Range (₹)
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    Tax Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-50 dark:bg-neutral-900/50" : ""}>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.range}</td>
                    <td className="px-4 py-2 font-medium text-green-600 dark:text-green-500">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Features</h4>
          <ul className="mt-2 space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="mt-0.5 text-green-600 dark:text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}