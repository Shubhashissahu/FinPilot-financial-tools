"use client";

import { useEffect, useState } from "react";
import {
  fetchCurrencyList,
  convertCurrency,
  ConversionResult,
} from "@/lib/currencyApi";
import BackButton from "@/components/BackButton";

export default function CurrencyConverterPage() {
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [listError, setListError] = useState("");

  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  const [result, setResult] = useState<ConversionResult | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

  // Load the real supported-currency list once on mount, instead of
  // hardcoding a guessed list that could drift from what the API actually
  // supports.
  useEffect(() => {
    fetchCurrencyList()
      .then((list) => {
        setCurrencies(list);
        setLoadingCurrencies(false);
      })
      .catch((err) => {
        setListError(err instanceof Error ? err.message : "Failed to load currencies.");
        setLoadingCurrencies(false);
      });
  }, []);

  const handleConvert = async () => {
    const numericAmount = Number(amount);
    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount.");
      setResult(null);
      return;
    }

    setError("");
    setConverting(true);
    try {
      const res = await convertCurrency(from, to, numericAmount);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
      setResult(null);
    } finally {
      setConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-green-50 dark:bg-[#0a0a0a] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <BackButton />
        <h1 className="text-center text-4xl font-black text-green-700">
          Currency Converter
        </h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 dark:text-gray-500">
          Live exchange rates, updated daily via the European Central Bank.
        </p>

        <section className="mt-10 rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm">
          {loadingCurrencies ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Loading currencies…</p>
          ) : listError ? (
            <p className="text-sm text-red-600">{listError}</p>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />

              <div className="mt-6 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    From
                  </label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    {Object.entries(currencies).map(([code, name]) => (
                      <option key={code} value={code}>
                        {code} — {name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={swapCurrencies}
                  aria-label="Swap currencies"
                  className="mb-1 rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-3 text-gray-600 dark:text-gray-400 dark:text-gray-500 transition hover:border-green-400 hover:text-green-600"
                >
                  ⇄
                </button>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    To
                  </label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    {Object.entries(currencies).map(([code, name]) => (
                      <option key={code} value={code}>
                        {code} — {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                onClick={handleConvert}
                disabled={converting}
                className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {converting ? "Converting…" : "Convert"}
              </button>
            </>
          )}
        </section>

        {result && (
          <section className="mt-8 rounded-2xl bg-white dark:bg-neutral-900 p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              {result.amount.toLocaleString()} {result.from} =
            </p>
            <p className="mt-2 text-4xl font-bold text-green-700">
              {result.convertedAmount.toLocaleString()} {result.to}
            </p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              1 {result.from} = {result.rate} {result.to} · as of {result.date}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}