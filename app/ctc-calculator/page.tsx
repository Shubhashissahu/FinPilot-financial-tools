"use client";

import { useState, useMemo } from "react";
import { calculateCtc, CtcInputs } from "@/lib/calculators/ctcCalculator";
import { generateCtcPdf } from "@/lib/pdf/CtcPdf";

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

const FAQ_ITEMS: { title: string; body: React.ReactNode }[] = [
  {
    title: "What is Basic Salary?",
    body: "Basic Salary is the fixed core of your pay before allowances. It auto-fills as whatever percentage of your CTC remains after HRA, DA, LTA, Special Allowance, and Performance Bonus are allocated.",
  },
  {
    title: "Understanding HRA",
    body: "House Rent Allowance (HRA) helps employees meet rental expenses. It's typically 40–50% of basic salary for metro cities.",
  },
  {
    title: "Tax Benefits",
    body: "Components like HRA, LTA, and EPF contributions can help reduce your taxable income under some regimes. Consult a tax professional to maximize your benefits.",
  },
  {
    title: "Understanding EPF",
    body: "EPF is commonly calculated on Basic + DA. Some employers cap the monthly PF wage at ₹15,000 (12% = ₹1,800/month), while others contribute on actual wages.",
  },
  {
    title: "Standard Deduction",
    body: (
      <>
        Standard deduction is a flat amount that reduces your taxable income:
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Old Tax Regime: ₹50,000 per year</li>
          <li>New Tax Regime (Tax Year 2026-27): ₹75,000 per year</li>
        </ul>
      </>
    ),
  },
];

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200";

export default function CtcCalculatorPage() {
  const [ctcInput, setCtcInput] = useState("12,22,222");
  const [ctcPeriod, setCtcPeriod] = useState<CtcPeriod>("yearly");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openFaq, setOpenFaq] = useState<Set<number>>(new Set([1, 2, 3, 4]));

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

  const earningsRows: [string, number, boolean?][] = [
    ["Basic Salary", result.basic],
    ["HRA", result.hra],
    ["DA", result.da],
    ["LTA", result.lta],
    ["Special Allowance", result.specialAllowance],
    ["Performance Bonus", result.performanceBonus],
    ["Gross Salary", result.grossSalary, true],
  ];

  const deductionRows: [string, number, boolean][] = [
    ...(epfApplicable ? [["Employee EPF", -result.employeeEpf, false] as [string, number, boolean]] : []),
    ...(result.esiApplicable ? [["Employee ESI", -result.employeeEsi, false] as [string, number, boolean]] : []),
    ...(professionalTaxApplicable ? [["Professional Tax", -result.professionalTax, false] as [string, number, boolean]] : []),
    ["Income Tax", -result.incomeTax, false],
    ["Total Deductions", -result.totalDeductions, true],
  ];

  const employerRows: [string, number, boolean?][] = [
    ["Gross Salary", result.grossSalary],
    ...(epfApplicable ? [["Employer EPF Contribution", result.employerEpf] as [string, number]] : []),
    ...(result.esiApplicable ? [["Employer ESI Contribution", result.employerEsi] as [string, number]] : []),
    ["Effective Employer Cost", result.effectiveCtc, true],
  ];

  const toggleFaq = (index: number) =>
    setOpenFaq((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

  return (
    <main className="min-h-screen bg-green-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-4xl font-black text-green-700">CTC Calculator</h1>
        <p className="mt-3 text-center text-gray-600">
          Estimate your take-home salary from your Cost to Company — New Tax Regime, FY 2026-27.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* LEFT: inputs */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <label className="text-sm font-medium text-gray-700">Cost to Company (CTC)</label>
            <div className="mt-2 flex items-center rounded-lg border border-gray-300 px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200">
              <span className="text-gray-400">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={ctcInput}
                onChange={(e) => setCtcInput(formatWithCommas(e.target.value))}
                placeholder={ctcPeriod === "yearly" ? "e.g. 12,00,000" : "e.g. 1,00,000"}
                className="ml-2 flex-1 text-gray-900 placeholder:text-gray-400 outline-none"
              />
              <span className="text-sm text-gray-400">{ctcPeriod}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter your {ctcPeriod} Cost to Company (CTC) amount in Indian Rupees.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
              {(["monthly", "yearly"] as CtcPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setCtcPeriod(period)}
                  className={`rounded-md py-2 text-sm font-medium capitalize transition ${
                    ctcPeriod === period ? "bg-green-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Basic Salary auto-fills as whatever percentage remains after the components below ({basicPercent}% currently).
            </p>
            {ctcEmpty && <p className="mt-2 text-xs font-medium text-gray-500">Enter your {ctcPeriod} CTC to see a breakdown.</p>}
            {ctcTooLow && (
              <p className="mt-2 text-xs font-medium text-red-600">
                This CTC is too low to produce a meaningful result — fixed costs like Professional Tax (₹2,400/yr) exceed it.
                Enter a realistic {ctcPeriod} CTC.
              </p>
            )}

            <button onClick={() => setShowAdvanced((v) => !v)} className="mt-6 text-sm font-medium text-green-700 hover:underline">
              {showAdvanced ? "Hide" : "Show"} Advanced Settings
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-5">
                {percentFields.map(([label, value, onChange]) => (
                  <div key={label} className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">{label}</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-right text-sm text-gray-900"
                    />
                  </div>
                ))}
                {allocatedPercent > 100 && (
                  <p className="text-xs text-red-600">
                    These percentages add up to {allocatedPercent}%, leaving no room for Basic Salary. Reduce one of them.
                  </p>
                )}

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={epfApplicable} onChange={(e) => setEpfApplicable(e.target.checked)} />
                  EPF Applicable
                </label>

                {epfApplicable && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <label className="text-sm font-medium text-gray-700">PF Wage Basis</label>
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
                        <label className="text-xs text-gray-500">Employee EPF %</label>
                        <input
                          type="number"
                          value={employeeEpfPercent}
                          onChange={(e) => setEmployeeEpfPercent(Number(e.target.value))}
                          className={`mt-1 ${inputClass}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Employer EPF %</label>
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

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={professionalTaxApplicable}
                    onChange={(e) => setProfessionalTaxApplicable(e.target.checked)}
                  />
                  Professional Tax Applicable (simplified flat ₹200/month)
                </label>
              </div>
            )}
          </section>

          {/* RIGHT: results */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">Salary Breakdown · New Tax Regime FY 2026-27</h2>

            {!showBreakdown ? (
              <div className="mt-8 flex items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
                <p className="text-sm text-gray-500">
                  {ctcEmpty ? "Your breakdown will appear here once you enter a CTC." : "Enter a higher CTC to see a valid breakdown."}
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {[
                    ["Net Monthly", result.netMonthlySalary],
                    ["Net Annual", result.netAnnualSalary],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-green-50 p-4">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className={`mt-1 text-xl font-bold ${(value as number) < 0 ? "text-red-600" : "text-green-700"}`}>
                        ₹{(value as number).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <BreakdownSection title="Earnings">
                  {earningsRows.map(([label, value, bold]) => (
                    <Row key={label} label={label} value={value} bold={bold} />
                  ))}
                </BreakdownSection>

                <BreakdownSection title="Tax Calculation">
                  <Row label="Standard Deduction" value={-result.standardDeduction} negative />
                  <Row label="Taxable Income" value={result.taxableIncome} muted />
                  <Row label="Income Tax" value={-result.incomeTax} negative />
                  <p className="mt-2 text-xs text-gray-400">
                    Standard Deduction only reduces taxable income for tax purposes — it isn&apos;t cash taken out of your
                    salary, so it&apos;s not included in the deductions below.
                  </p>
                </BreakdownSection>

                <BreakdownSection title="Deductions from Salary">
                  {deductionRows.map(([label, value, bold]) => (
                    <Row key={label} label={label} value={value} bold={bold} negative />
                  ))}
                </BreakdownSection>

                <BreakdownSection title="Employer Cost (informational)">
                  {employerRows.map(([label, value, bold], i) => (
                    <Row key={label} label={label} value={value} bold={bold} muted={i < employerRows.length - 1} />
                  ))}
                </BreakdownSection>

                <button
                  onClick={() => generateCtcPdf(annualCtc, result)}
                  className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Download PDF
                </button>
              </>
            )}
          </section>
        </div>

        {/* Understanding Your CTC */}
        <div className="mt-10 rounded-2xl bg-blue-50 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-blue-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-300 text-sm">?</span>
            Understanding Your CTC
          </h2>
          <p className="mt-3 text-sm text-blue-800">
            Cost to Company (CTC) is the total amount your employer spends on you annually, including all benefits and
            contributions.
          </p>
          <p className="mt-2 text-sm text-blue-800">
            Your take-home salary will be lower than your CTC due to various deductions and the fact that some components
            are non-monetary benefits.
          </p>
        </div>

        <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-100 bg-white shadow-sm">
          {FAQ_ITEMS.map((item, index) => (
            <div key={item.title}>
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                aria-expanded={openFaq.has(index)}
              >
                <span className="font-semibold text-gray-900">{item.title}</span>
                <svg
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${openFaq.has(index) ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq.has(index) && <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600">{item.body}</div>}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-amber-50 p-6">
          <p className="font-semibold text-amber-800">Important Note</p>
          <p className="mt-1 text-sm text-amber-700">
            This calculator provides estimates based on standard deductions and tax rates. Actual figures may vary based
            on your specific situation, tax regime choice, and company policies.
          </p>
        </div>
      </div>
    </main>
  );
}

function BreakdownSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  negative,
  muted,
}: {
  label: string;
  value: number;
  bold?: boolean;
  negative?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? "text-gray-400" : "text-gray-600"}>{label}</span>
      <span className={`${bold ? "font-semibold text-gray-900" : "text-gray-800"} ${negative ? "text-red-600" : ""}`}>
        {negative && value < 0 ? "-" : ""}₹{Math.abs(value).toLocaleString("en-IN")}
      </span>
    </div>
  );
}