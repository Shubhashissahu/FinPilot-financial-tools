import { BillItem, Person, PersonBillResult, PersonItemShare } from "@/types/bill";

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

function reconcileRounding(rawAmounts: number[], targetTotal: number): number[] {
  const targetCents = Math.round(targetTotal * 100);
  const floors = rawAmounts.map((a) => Math.floor(a * 100));
  const remainders = rawAmounts.map((a, i) => a * 100 - floors[i]);

  let leftover = targetCents - floors.reduce((sum, c) => sum + c, 0);

  const order = remainders
    .map((r, i) => ({ r, i }))
    .sort((a, b) => b.r - a.r)
    .map((x) => x.i);

  const cents = [...floors];
  let idx = 0;
  while (leftover > 0 && order.length > 0) {
    cents[order[idx % order.length]] += 1;
    leftover -= 1;
    idx += 1;
  }
  while (leftover < 0 && order.length > 0) {
    cents[order[idx % order.length]] -= 1;
    leftover += 1;
    idx += 1;
  }

  return cents.map((c) => c / 100);
}

export interface SplitBillError {
  message: string;
}

export function validateBill(people: Person[], items: BillItem[]): SplitBillError | null {
  if (people.length === 0) {
    return { message: "Add at least one person before splitting." };
  }
  const names = new Set<string>();
  for (const p of people) {
    const clean = p.name.trim().toLowerCase();
    if (!clean) return { message: "Every person needs a name." };
    if (names.has(clean)) return { message: `"${p.name.trim()}" is listed twice — names need to be unique.` };
    names.add(clean);
  }
  if (items.length === 0) {
    return { message: "Add at least one item from the bill." };
  }
  for (const item of items) {
    if (!item.name.trim()) return { message: "Every item needs a name." };
    if (!(item.price > 0)) return { message: `"${item.name.trim() || "An item"}" needs a price greater than 0.` };
    if (!item.isShared && item.assignedTo.length === 0) {
      return { message: `"${item.name}" isn't marked shared and isn't assigned to anyone — pick one or the other.` };
    }
  }
  return null;
}

export interface SplitSummary {
  results: PersonBillResult[];
  billSubtotal: number;
  gstAmount: number;
  tipAmount: number;
  grandTotal: number;
}

export function splitBill(
  people: Person[],
  items: BillItem[],
  gstPercentage: number,
  tipPercentage: number
): SplitSummary {
  const safeGst = Number.isFinite(gstPercentage) && gstPercentage > 0 ? gstPercentage : 0;
  const safeTip = Number.isFinite(tipPercentage) && tipPercentage > 0 ? tipPercentage : 0;

  const personSubtotals = new Map<string, number>();
  const personLines = new Map<string, PersonItemShare[]>();
  for (const p of people) {
    personSubtotals.set(p.id, 0);
    personLines.set(p.id, []);
  }

  let billSubtotal = 0;

  for (const item of items) {
    billSubtotal += item.price;
    const assignees = item.isShared ? people.map((p) => p.id) : item.assignedTo;
    if (assignees.length === 0) continue; // guarded by validateBill, but stay defensive
    const share = item.price / assignees.length;

    for (const pid of assignees) {
      personSubtotals.set(pid, (personSubtotals.get(pid) ?? 0) + share);
      personLines.get(pid)?.push({ itemId: item.id, name: item.name, amount: round2(share) });
    }
  }

  billSubtotal = round2(billSubtotal);
  const gstAmount = round2(billSubtotal * (safeGst / 100));
  const tipAmount = round2(billSubtotal * (safeTip / 100));
  const grandTotal = round2(billSubtotal + gstAmount + tipAmount);

  const rawSubtotals = people.map((p) => personSubtotals.get(p.id) ?? 0);
  const reconciledSubtotals = reconcileRounding(rawSubtotals, billSubtotal);

  const rawGstShares = people.map((_, i) =>
    billSubtotal > 0 ? (rawSubtotals[i] / billSubtotal) * gstAmount : 0
  );
  const reconciledGst = reconcileRounding(rawGstShares, gstAmount);

  const rawTipShares = people.map((_, i) =>
    billSubtotal > 0 ? (rawSubtotals[i] / billSubtotal) * tipAmount : 0
  );
  const reconciledTip = reconcileRounding(rawTipShares, tipAmount);

  const results: PersonBillResult[] = people.map((p, i) => ({
    personId: p.id,
    name: p.name,
    items: personLines.get(p.id) ?? [],
    subtotal: reconciledSubtotals[i],
    gstAmount: reconciledGst[i],
    tipAmount: reconciledTip[i],
    total: round2(reconciledSubtotals[i] + reconciledGst[i] + reconciledTip[i]),
  }));

  return { results, billSubtotal, gstAmount, tipAmount, grandTotal };
}

export function buildWhatsAppMessage(summary: SplitSummary): string {
  const lines: string[] = [];
  lines.push("🧾 *Bill split*");
  lines.push("");
  for (const person of summary.results) {
    lines.push(`*${person.name}* — ₹${person.total.toFixed(2)}`);
    for (const line of person.items) {
      lines.push(`  • ${line.name} — ₹${line.amount.toFixed(2)}`);
    }
    lines.push("");
  }
  lines.push(`Subtotal: ₹${summary.billSubtotal.toFixed(2)}`);
  lines.push(`GST: ₹${summary.gstAmount.toFixed(2)}`);
  lines.push(`Tip: ₹${summary.tipAmount.toFixed(2)}`);
  lines.push(`*Total: ₹${summary.grandTotal.toFixed(2)}*`);
  return lines.join("\n");
}