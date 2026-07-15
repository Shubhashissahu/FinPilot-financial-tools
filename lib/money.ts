//lib/money
export function rupeesToPaise(amount: number): number {
  return Math.round(amount * 100);
}

export function paiseToRupees(amount: number): number {
  return amount / 100;
}

export function allocateProportionally(
  totalPaise: number,
  weights: number[]
): number[] {
  if (weights.length === 0) {
    return [];
  }

  const totalWeight = weights.reduce(
    (sum, weight) => sum + weight,
    0
  );

  if (totalWeight === 0) {
    return weights.map(() => 0);
  }

  const rawShares = weights.map(
    (weight) => (totalPaise * weight) / totalWeight
  );

  const shares = rawShares.map(Math.floor);

  let remainder =
    totalPaise -
    shares.reduce((sum, share) => sum + share, 0);

  const remainderOrder = rawShares
    .map((share, index) => ({
      index,
      fraction: share - Math.floor(share),
    }))
    .sort((a, b) => b.fraction - a.fraction);

  let position = 0;

  while (remainder > 0) {
    shares[remainderOrder[position].index]++;
    remainder--;
    position = (position + 1) % remainderOrder.length;
  }

  return shares;
}