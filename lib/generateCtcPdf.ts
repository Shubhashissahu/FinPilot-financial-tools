//lib/generatedCtcpdf
import { jsPDF } from "jspdf";
import { CtcBreakdown } from "@/lib/ctcCalculator";

export function generateCtcPdf(annualCtc: number, result: CtcBreakdown) {
  const pdf = new jsPDF();
  let y = 20;

  pdf.setFontSize(22);
  pdf.text("SplitEasy", 20, y);
  y += 10;
  pdf.setFontSize(11);
  pdf.text("CTC Breakdown — New Tax Regime FY 2026-27", 20, y);
  y += 20;
  pdf.setFontSize(12);

  const rows: [string, string][] = [
    ["Cost to Company (entered)", `Rs. ${annualCtc.toLocaleString("en-IN")}`],
    ["Basic Salary", `Rs. ${result.basic.toLocaleString("en-IN")}`],
    ["HRA", `Rs. ${result.hra.toLocaleString("en-IN")}`],
    ["DA", `Rs. ${result.da.toLocaleString("en-IN")}`],
    ["LTA", `Rs. ${result.lta.toLocaleString("en-IN")}`],
    ["Special Allowance", `Rs. ${result.specialAllowance.toLocaleString("en-IN")}`],
    ["Performance Bonus", `Rs. ${result.performanceBonus.toLocaleString("en-IN")}`],
    ["Gross Salary", `Rs. ${result.grossSalary.toLocaleString("en-IN")}`],
    ["Employee EPF", `-Rs. ${result.employeeEpf.toLocaleString("en-IN")}`],
    ["Employee ESI", `-Rs. ${result.employeeEsi.toLocaleString("en-IN")}`],
    ["Professional Tax", `-Rs. ${result.professionalTax.toLocaleString("en-IN")}`],
    ["Income Tax", `-Rs. ${result.incomeTax.toLocaleString("en-IN")}`],
    ["Net Annual Salary", `Rs. ${result.netAnnualSalary.toLocaleString("en-IN")}`],
    ["Net Monthly Salary", `Rs. ${result.netMonthlySalary.toLocaleString("en-IN")}`],
  ];

  rows.forEach(([label, value]) => {
    pdf.text(label, 20, y);
    pdf.text(value, 130, y);
    y += 10;
  });

  pdf.save("CTC-breakdown.pdf");
}
