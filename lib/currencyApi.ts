const BASE_URL = "https://api.frankfurter.dev/v1";

export interface ConversionResult {
  from: string;
  to: string;
  rate: number;
  amount: number;
  convertedAmount: number;
  date: string;
}

export async function fetchCurrencyList(): Promise<Record<string, string>> {
  const res = await fetch(`${BASE_URL}/currencies`);
  if (!res.ok) {
    throw new Error("Couldn't load the currency list. Try again in a moment.");
  }
  return res.json();
}

export async function convertCurrency(
  from: string,
  to: string,
  amount: number
): Promise<ConversionResult> {
  if (from === to) {
    return { from, to, rate: 1, amount, convertedAmount: amount, date: "—" };
  }

  const res = await fetch(`${BASE_URL}/latest?base=${from}&symbols=${to}`);
  if (!res.ok) {
    throw new Error("Couldn't fetch the exchange rate. Try again in a moment.");
  }

  const data = await res.json();
  const rate = data.rates?.[to];

  if (typeof rate !== "number") {
    throw new Error(`No rate available for ${from} → ${to}.`);
  }

  return {
    from,
    to,
    rate,
    amount,
    convertedAmount: Math.round(amount * rate * 100) / 100,
    date: data.date,
  };
}