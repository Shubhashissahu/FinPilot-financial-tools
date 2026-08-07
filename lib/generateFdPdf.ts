import { jsPDF } from "jspdf";
import { FdResult } from "@/lib/fdCalculator";

export function generateFdPdf(
  result: FdResult,
  annualRate: number,
  tenureYears: number,
  compoundingLabel: string = "quarterly"
) {
  const pdf = new jsPDF();

  let y = 20;

  pdf.setFontSize(22);
  pdf.text("SplitEasy", 20, y);

  y += 10;
  pdf.setFontSize(11);
  pdf.text("Fixed Deposit Calculation Summary", 20, y);

  y += 20;
  pdf.setFontSize(12);

  const rows: [string, string][] = [
    ["Principal Amount", `Rs. ${result.principal.toLocaleString("en-IN")}`],
    ["Annual Interest Rate", `${annualRate}% (compounded ${compoundingLabel})`],
    ["Tenure", `${tenureYears} years`],
    ["Maturity Value", `Rs. ${result.maturityValue.toLocaleString("en-IN")}`],
    ["Total Interest Earned", `Rs. ${result.totalInterest.toLocaleString("en-IN")}`],
    ["Effective Annual Yield", `${result.effectiveAnnualYield}%`],
  ];

  rows.forEach(([label, value]) => {
    pdf.text(label, 20, y);
    pdf.text(value, 120, y);
    y += 12;
  });

  pdf.save("FD-calculation.pdf");
}