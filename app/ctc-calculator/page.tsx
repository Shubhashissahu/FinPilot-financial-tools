"use client";

import { useState, useMemo } from "react";
import { calculateCtc, CtcInputs } from "@/lib/calculators/ctcCalculator";
import { FaqAccordion } from "@/components/ctc-calculator/FaqAccordion";
import { ResultsTable } from "@/components/ctc-calculator/ResultsTable";
const DEFAULTS = {
  hraPercent: 20,
  daPercent: 10,
  ltaPercent: 5,
  specialAllowancePercent: 15,
  performanceBonusPercent: 10,
  employeeEpfPercent: 12,
  employerEpfPercent: 12,
};

const MIN_REALISTIC_CTC = 100000; // ₹1L/year — below this, fixed statutory
// costs like Professional Tax (₹2,400/yr flat) will always exceed gross
// salary, producing a negative "net salary" that isn't a real result.

type CtcPeriod = "monthly" | "yearly";



const inputClass =
  "w-full rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200";

export default function CtcCalculatorPage() {
  const [ctcInput, setCtcInput] = useState("12,22,222");
  const [ctcPeriod, setCtcPeriod] = useState<CtcPeriod>("yearly");
  const [showAdvanced, setShowAdvanced] = useState(false);


  const [hraPercent, setHraPercent] = useState(DEFAULTS.hraPercent);
  const [daPercent, setDaPercent] = useState(DEFAULTS.daPercent);
  const [ltaPercent, setLtaPercent] = useState(DEFAULTS.ltaPercent);
  const [specialAllowancePercent, setSpecialAllowancePercent] = useState(DEFAULTS.specialAllowancePercent);
  const [performanceBonusPercent, setPerformanceBonusPercent] = useState(DEFAULTS.performanceBonusPercent);

  const [epfApplicable, setEpfApplicable] = useState(true);
  const [pfWageCapped, setPfWageCapped] = useState(true);
  const [employeeEpfPercent, setEmployeeEpfPercent] = useState(DEFAULTS.employeeEpfPercent);
  const [employerEpfPercent, setEmployerEpfPercent] = useState(DEFAULTS.employerEpfPercent);
  const [professionalTaxApplicable, setProfessionalTaxApplicable] = useState(true);

  const formatWithCommas = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    return digits ? Number(digits).toLocaleString("en-IN") : "";
  };

  const enteredAmount = Number(ctcInput.replace(/,/g, "")) || 0;
  const annualCtc = ctcPeriod === "monthly" ? enteredAmount * 12 : enteredAmount;
  const ctcEmpty = annualCtc <= 0;
  const ctcTooLow = !ctcEmpty && annualCtc < MIN_REALISTIC_CTC;
  const showBreakdown = !ctcEmpty && !ctcTooLow;

  const result = useMemo(() => {
    const inputs: CtcInputs = {
      annualCtc,
      hraPercent,
      daPercent,
      ltaPercent,
      specialAllowancePercent,
      performanceBonusPercent,
      epfApplicable,
      pfWageCapped,
      employeeEpfPercent,
      employerEpfPercent,
      professionalTaxApplicable,
    };
    return calculateCtc(inputs);
  }, [
    annualCtc,
    hraPercent,
    daPercent,
    ltaPercent,
    specialAllowancePercent,
    performanceBonusPercent,
    epfApplicable,
    pfWageCapped,
    employeeEpfPercent,
    employerEpfPercent,
    professionalTaxApplicable,
  ]);


  const allocatedPercent = hraPercent + daPercent + ltaPercent + specialAllowancePercent + performanceBonusPercent;
  const basicPercent = Math.max(0, 100 - allocatedPercent);

  const percentFields: [string, number, (v: number) => void][] = [
    ["HRA %", hraPercent, setHraPercent],
    ["DA %", daPercent, setDaPercent],
    ["LTA %", ltaPercent, setLtaPercent],
    ["Special Allowance %", specialAllowancePercent, setSpecialAllowancePercent],
    ["Performance Bonus %", performanceBonusPercent, setPerformanceBonusPercent],
  ];





  return (
    <main className="min-h-screen bg-green-50 dark:bg-[#0a0a0a] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-4xl font-black text-green-700">CTC Calculator</h1>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400 dark:text-gray-500">
          Estimate your take-home salary from your Cost to Company — New Tax Regime, FY 2026-27.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* LEFT: inputs */}
          <section className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost to Company (CTC)</label>
            <div className="mt-2 flex items-center rounded-lg border border-gray-300 dark:border-neutral-700 px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200">
              <span className="text-gray-400 dark:text-gray-500">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={ctcInput}
                onChange={(e) => setCtcInput(formatWithCommas(e.target.value))}
                placeholder={ctcPeriod === "yearly" ? "e.g. 12,00,000" : "e.g. 1,00,000"}
                className="ml-2 flex-1 text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-500 outline-none"
              />
              <span className="text-sm text-gray-400 dark:text-gray-500">{ctcPeriod}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Enter your {ctcPeriod} Cost to Company (CTC) amount in Indian Rupees.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 dark:bg-neutral-800 p-1">
              {(["monthly", "yearly"] as CtcPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setCtcPeriod(period)}
                  className={`rounded-md py-2 text-sm font-medium capitalize transition-all duration-200 active:scale-95 ${
                    ctcPeriod === period ? "bg-green-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              Basic Salary auto-fills as whatever percentage remains after the components below ({basicPercent}% currently).
            </p>
            {ctcEmpty && <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Enter your {ctcPeriod} CTC to see a breakdown.</p>}
            {ctcTooLow && (
              <p className="mt-2 text-xs font-medium text-red-600">
                This CTC is too low to produce a meaningful result — fixed costs like Professional Tax (₹2,400/yr) exceed it.
                Enter a realistic {ctcPeriod} CTC.
              </p>
            )}

            <button onClick={() => setShowAdvanced((v) => !v)} className="mt-6 text-sm font-medium text-green-700 transition-colors hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 hover:underline">
              {showAdvanced ? "Hide" : "Show"} Advanced Settings
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                showAdvanced ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-4 space-y-5 pb-1">
                {percentFields.map(([label, value, onChange]) => (
                  <div key={label} className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      className="w-20 rounded-lg border border-gray-300 dark:border-neutral-700 px-2 py-1 text-right text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                ))}
                {allocatedPercent > 100 && (
                  <p className="text-xs text-red-600">
                    These percentages add up to {allocatedPercent}%, leaving no room for Basic Salary. Reduce one of them.
                  </p>
                )}

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={epfApplicable} onChange={(e) => setEpfApplicable(e.target.checked)} />
                  EPF Applicable
                </label>

                {epfApplicable && (
                  <div className="rounded-lg bg-gray-50 dark:bg-neutral-900/50 p-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">PF Wage Basis</label>
                    <select
                      value={pfWageCapped ? "capped" : "actual"}
                      onChange={(e) => setPfWageCapped(e.target.value === "capped")}
                      className={`mt-2 ${inputClass}`}
                    >
                      <option value="capped">Capped at ₹15,000 wage (statutory ceiling)</option>
                      <option value="actual">Actual Basic + DA</option>
                    </select>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Employee EPF %</label>
                        <input
                          type="number"
                          value={employeeEpfPercent}
                          onChange={(e) => setEmployeeEpfPercent(Number(e.target.value))}
                          className={`mt-1 ${inputClass}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Employer EPF %</label>
                        <input
                          type="number"
                          value={employerEpfPercent}
                          onChange={(e) => setEmployerEpfPercent(Number(e.target.value))}
                          className={`mt-1 ${inputClass}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={professionalTaxApplicable}
                    onChange={(e) => setProfessionalTaxApplicable(e.target.checked)}
                  />
                  Professional Tax Applicable (simplified flat ₹200/month)
                </label>
              </div>
            </div>
          </div>
          </section>

          {/* RIGHT: results */}
          <section className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 dark:text-white">Salary Breakdown · New Tax Regime FY 2026-27</h2>
            <ResultsTable
              result={result}
              epfApplicable={epfApplicable}
              professionalTaxApplicable={professionalTaxApplicable}
              annualCtc={annualCtc}
              ctcEmpty={ctcEmpty}
              showBreakdown={showBreakdown}
            />
          </section>
        </div>

        <FaqAccordion />

        <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 p-6">
          <p className="font-semibold text-amber-800 dark:text-amber-300">Important Note</p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-200/90">
            This calculator provides estimates based on standard deductions and tax rates. Actual figures may vary based
            on your specific situation, tax regime choice, and company policies.
          </p>
        </div>
      </div>
    </main>
  );
}
