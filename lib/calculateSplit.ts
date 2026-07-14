import {
  BillItem,
  Person,
  PersonBillResult,
} from "@/types/bill";

export function calculateSplit(
  people: Person[],
  items: BillItem[],
  gst: number,
  tip: number
): PersonBillResult[] {
  const results: PersonBillResult[] = people.map(
    (person) => ({
      personId: person.id,
      name: person.name,
      items: [],
      subtotal: 0,
      gstAmount: 0,
      tipAmount: 0,
      total: 0,
    })
  );

  items.forEach((item) => {
    if (item.assignedTo.length === 0) {
      return;
    }

    const share =
      item.price / item.assignedTo.length;

    item.assignedTo.forEach((personId) => {
      const personResult = results.find(
        (result) =>
          result.personId === personId
      );

      if (!personResult) {
        return;
      }

      personResult.items.push({
        itemId: item.id,
        name: item.name,
        amount: share,
      });

      personResult.subtotal += share;
    });
  });

  results.forEach((result) => {
    result.gstAmount =
      result.subtotal * (gst / 100);

    result.tipAmount =
      result.subtotal * (tip / 100);

    result.total =
      result.subtotal +
      result.gstAmount +
      result.tipAmount;
  });

  return results;
}