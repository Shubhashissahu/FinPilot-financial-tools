import { jsPDF } from "jspdf";
import { EmiResult } from "@/lib/emiCalculator";

export function generateEmiPdf(result: EmiResult, annualRate: number) {
  const pdf = new jsPDF();

  let y = 20;

  pdf.setFontSize(22);
  pdf.text("FinanceKit", 20, y);

  y += 10;
  pdf.setFontSize(11);
  pdf.text("EMI Calculation Summary", 20, y);

  y += 20;
  pdf.setFontSize(12);

  const rows: [string, string][] = [
    ["Loan Amount", `Rs. ${result.principal.toLocaleString("en-IN")}`],
    ["Annual Interest Rate", `${annualRate}%`],
    ["Loan Tenure", `${result.tenureMonths} months (${(result.tenureMonths / 12).toFixed(1)} years)`],
    ["Monthly EMI", `Rs. ${result.monthlyEmi.toLocaleString("en-IN")}`],
    ["Yearly Payment", `Rs. ${result.yearlyPayment.toLocaleString("en-IN")}`],
    ["Total Interest", `Rs. ${result.totalInterest.toLocaleString("en-IN")}`],
    ["Total Payment", `Rs. ${result.totalPayment.toLocaleString("en-IN")}`],
  ];

  rows.forEach(([label, value]) => {
    pdf.text(label, 20, y);
    pdf.text(value, 120, y);
    y += 12;
  });

  pdf.save("EMI-calculation.pdf");
}