import { jsPDF } from "jspdf";

import { PersonBillResult } from "@/types/bill";

export function generateBillPdf(
  result: PersonBillResult
) {
  const pdf = new jsPDF();

  let y = 20;

  pdf.setFontSize(22);
  pdf.text("SplitEasy", 20, y);

  y += 10;

  pdf.setFontSize(11);
  pdf.text("Simple. Fair. Stress-free.", 20, y);

  y += 20;

  pdf.setFontSize(18);
  pdf.text(`${result.name}'s Bill`, 20, y);

  y += 15;

  pdf.setFontSize(12);

  result.items.forEach((item) => {
    pdf.text(
      item.name,
      20,
      y
    );

    pdf.text(
      `Rs. ${item.amount.toFixed(2)}`,
      150,
      y
    );

    y += 10;
  });

  y += 5;

  pdf.line(20, y, 190, y);

  y += 10;

  pdf.text(
    `Subtotal: Rs. ${result.subtotal.toFixed(2)}`,
    20,
    y
  );

  y += 10;

  pdf.text(
    `GST: Rs. ${result.gstAmount.toFixed(2)}`,
    20,
    y
  );

  y += 10;

  pdf.text(
    `Tip: Rs. ${result.tipAmount.toFixed(2)}`,
    20,
    y
  );

  y += 10;

  pdf.setFontSize(15);

  pdf.text(
    `Total to pay: Rs. ${result.total.toFixed(2)}`,
    20,
    y
  );

  pdf.save(
    `${result.name}-bill.pdf`
  );
}
export function generateFullBillPdf(
  results: PersonBillResult[]
) {
  const pdf = new jsPDF();

  let y = 20;

  const grandTotal = results.reduce(
    (total, result) => total + result.total,
    0
  );

  pdf.setFontSize(22);
  pdf.text("SplitEasy", 20, y);

  y += 10;

  pdf.setFontSize(11);
  pdf.text("Bill Split Summary", 20, y);

  y += 15;

  pdf.setFontSize(14);
  pdf.text(
    `Grand Total: Rs. ${grandTotal.toFixed(2)}`,
    20,
    y
  );

  y += 15;

  results.forEach((result) => {
    if (y > 250) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(16);
    pdf.text(result.name, 20, y);

    y += 10;

    pdf.setFontSize(11);

    result.items.forEach((item) => {
      pdf.text(item.name, 25, y);

      pdf.text(
        `Rs. ${item.amount.toFixed(2)}`,
        150,
        y
      );

      y += 8;
    });

    pdf.text(
      `Total: Rs. ${result.total.toFixed(2)}`,
      25,
      y
    );

    y += 15;

    pdf.line(20, y, 190, y);

    y += 10;
  });

  pdf.save("SplitSmart-full-bill.pdf");
}