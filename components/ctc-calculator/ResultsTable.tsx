"use client";

import { generateCtcPdf } from "@/lib/pdf/CtcPdf";
import { CtcBreakdown } from "@/lib/calculators/ctcCalculator";

interface ResultsTableProps {
  result: CtcBreakdown;
  epfApplicable: boolean;
  professionalTaxApplicable: boolean;
  annualCtc: number;
  ctcEmpty: boolean;
  showBreakdown: boolean;
}

export function ResultsTable({
  result,
  epfApplicable,
  professionalTaxApplicable,
  annualCtc,
  ctcEmpty,
  showBreakdown,
}: ResultsTableProps) {
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

  if (!showBreakdown) {
    return (
      <div className="mt-8 flex items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-neutral-800 py-16 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
          {ctcEmpty ? "Your breakdown will appear here once you enter a CTC." : "Enter a higher CTC to see a valid breakdown."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {[
          ["Net Monthly", result.netMonthlySalary],
          ["Net Annual", result.netAnnualSalary],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-green-50 dark:bg-[#0a0a0a] p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{label}</p>
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
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Standard Deduction only reduces taxable income for tax purposes — it isn't cash taken out of your
          salary, so it's not included in the deductions below.
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
  );
}

function BreakdownSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-gray-100 dark:border-neutral-800 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{title}</p>
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
      <span className={muted ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-400 dark:text-gray-500"}>{label}</span>
      <span className={`${bold ? "font-semibold text-gray-900 dark:text-white" : "text-gray-800"} ${negative ? "text-red-600" : ""}`}>
        {negative && value < 0 ? "-" : ""}₹{Math.abs(value).toLocaleString("en-IN")}
      </span>
    </div>
  );
}
