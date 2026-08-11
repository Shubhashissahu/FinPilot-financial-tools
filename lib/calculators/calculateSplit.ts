//lib/calculateSplit
import {
  BillItem,
  Person,
  PersonBillResult,
} from "@/types/bill";

import {
  allocateProportionally,
  rupeesToPaise,
  paiseToRupees,
} from "@/lib/finance/money";

interface InternalItemShare {
  itemId: string;
  name: string;
  amountPaise: number;
}

interface InternalPersonResult {
  personId: string;
  name: string;
  items: InternalItemShare[];
  subtotalPaise: number;
}

function splitPaiseEqually(
  totalPaise: number,
  peopleCount: number
): number[] {
  if (peopleCount <= 0) {
    return [];
  }

  return allocateProportionally(
    totalPaise,
    Array(peopleCount).fill(1)
  );
}

export function calculateSplit(
  people: Person[],
  items: BillItem[],
  gst: number,
  tip: number
): PersonBillResult[] {
  const internalResults: InternalPersonResult[] =
    people.map((person) => ({
      personId: person.id,
      name: person.name,
      items: [],
      subtotalPaise: 0,
    }));

  items.forEach((item) => {
    // Shared items are resolved against the CURRENT people list at calc
    // time, not whatever list existed when the item was created. This is
    // the fix: previously assignedTo was frozen at checkbox-click time,
    // so adding someone to the bill later silently left them owing
    // nothing on items marked "shared by everyone."
    const assignees = item.isShared
      ? people.map((p) => p.id)
      : item.assignedTo;

    if (assignees.length === 0) {
      return;
    }

    const itemPricePaise = rupeesToPaise(item.price);

    const shares = splitPaiseEqually(
      itemPricePaise,
      assignees.length
    );

    assignees.forEach((personId, index) => {
      const personResult = internalResults.find(
        (result) => result.personId === personId
      );

      if (!personResult) {
        return;
      }

      const sharePaise = shares[index];

      personResult.items.push({
        itemId: item.id,
        name: item.name,
        amountPaise: sharePaise,
      });

      personResult.subtotalPaise += sharePaise;
    });
  });

  const subtotalWeights = internalResults.map(
    (result) => result.subtotalPaise
  );

  const totalSubtotalPaise = subtotalWeights.reduce(
    (sum, value) => sum + value,
    0
  );

  const totalGstPaise = Math.round(
    totalSubtotalPaise * (gst / 100)
  );

  const totalTipPaise = Math.round(
    totalSubtotalPaise * (tip / 100)
  );

  const gstShares = allocateProportionally(
    totalGstPaise,
    subtotalWeights
  );

  const tipShares = allocateProportionally(
    totalTipPaise,
    subtotalWeights
  );

  return internalResults.map((result, index) => {
    const gstPaise = gstShares[index];
    const tipPaise = tipShares[index];

    const totalPaise =
      result.subtotalPaise +
      gstPaise +
      tipPaise;

    return {
      personId: result.personId,
      name: result.name,

      items: result.items.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        amount: paiseToRupees(item.amountPaise),
      })),

      subtotal: paiseToRupees(result.subtotalPaise),
      gstAmount: paiseToRupees(gstPaise),
      tipAmount: paiseToRupees(tipPaise),
      total: paiseToRupees(totalPaise),
    };
  });
}