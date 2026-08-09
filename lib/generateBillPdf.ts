//lib/generateBillPdf
import { jsPDF } from "jspdf";

import { PersonBillResult } from "@/types/bill";

const PAGE_BOTTOM = 270; // leave margin below 297mm A4 height

function safeFileName(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|]/g, "").trim();
  return cleaned || "guest";
}

export function generateBillPdf(result: PersonBillResult) {
  const pdf = new jsPDF();

  let y = 20;

  pdf.setFontSize(22);
  pdf.text("FinanceKit", 20, y);

  y += 10;

  pdf.setFontSize(11);
  pdf.text("Simple. Fair. Stress-free.", 20, y);

  y += 20;

  pdf.setFontSize(18);
  pdf.text(`${result.name}'s Bill`, 20, y);

  y += 15;

  pdf.setFontSize(12);

  result.items.forEach((item) => {
    if (y > PAGE_BOTTOM) {
      pdf.addPage();
      y = 20;
    }

    pdf.text(item.name, 20, y);
    pdf.text(`Rs. ${item.amount.toFixed(2)}`, 150, y);

    y += 10;
  });

  if (y > PAGE_BOTTOM) {
    pdf.addPage();
    y = 20;
  }

  y += 5;
  pdf.line(20, y, 190, y);
  y += 10;

  pdf.text(`Subtotal: Rs. ${result.subtotal.toFixed(2)}`, 20, y);
  y += 10;

  pdf.text(`GST: Rs. ${result.gstAmount.toFixed(2)}`, 20, y);
  y += 10;

  pdf.text(`Tip: Rs. ${result.tipAmount.toFixed(2)}`, 20, y);
  y += 10;

  pdf.setFontSize(15);
  pdf.text(`Total to pay: Rs. ${result.total.toFixed(2)}`, 20, y);

  pdf.save(`${safeFileName(result.name)}-bill.pdf`);
}

export function generateFullBillPdf(results: PersonBillResult[]) {
  const pdf = new jsPDF();

  let y = 20;

  const grandTotal = results.reduce(
    (total, result) => total + result.total,
    0
  );

  pdf.setFontSize(22);
  pdf.text("FinanceKit", 20, y);

  y += 10;

  pdf.setFontSize(11);
  pdf.text("Bill Split Summary", 20, y);

  y += 15;

  pdf.setFontSize(14);
  pdf.text(`Grand Total: Rs. ${grandTotal.toFixed(2)}`, 20, y);

  y += 15;

  results.forEach((result) => {
    if (y > PAGE_BOTTOM) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(16);
    pdf.text(result.name, 20, y);

    y += 10;

    pdf.setFontSize(11);

    result.items.forEach((item) => {
      // This is the fix: paginate mid-list, not just between people.
      if (y > PAGE_BOTTOM) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(item.name, 25, y);
      pdf.text(`Rs. ${item.amount.toFixed(2)}`, 150, y);

      y += 8;
    });

    if (y > PAGE_BOTTOM) {
      pdf.addPage();
      y = 20;
    }

    pdf.text(`Total: Rs. ${result.total.toFixed(2)}`, 25, y);

    y += 15;
    pdf.line(20, y, 190, y);
    y += 10;
  });

  pdf.save("FinanceKit-full-bill.pdf");
}