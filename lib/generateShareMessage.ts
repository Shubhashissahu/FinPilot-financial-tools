import { PersonBillResult } from "@/types/bill";

export function generateShareMessage(
  result: PersonBillResult
): string {
  const itemLines = result.items
    .map(
      (item) =>
        `${item.name}: ₹${item.amount.toFixed(2)}`
    )
    .join("\n");

  return `Hey ${result.name} 

Here's your bill breakdown:

${itemLines}

Subtotal: ₹${result.subtotal.toFixed(2)}
GST: ₹${result.gstAmount.toFixed(2)}
Tip: ₹${result.tipAmount.toFixed(2)}

Total to pay: ₹${result.total.toFixed(2)}

Split with SplitEasy`;
}