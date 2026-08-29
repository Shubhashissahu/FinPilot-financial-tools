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
    <main className="min-h-screen bg-[#F7FAF8] dark:bg-[#0a0a0a] px-4 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <BackButton />
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Currency Converter
        </h1>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Live foreign exchange rates, updated daily via the European Central Bank.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs">
          {loadingCurrencies ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading currencies…</p>
          ) : listError ? (
            <p className="text-sm text-red-600">{listError}</p>
          ) : (
            <>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Amount
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />

              <div className="mt-5 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    From
                  </label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-slate-900 dark:text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm font-medium"
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
                  className="mb-0.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-950 px-3.5 py-3 text-slate-700 dark:text-slate-300 transition hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 active:scale-95"
                >
                  ⇄
                </button>

                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    To
                  </label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-slate-900 dark:text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm font-medium"
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
                className="mt-6 w-full rounded-xl bg-[#00A859] py-3.5 font-semibold text-white shadow-xs transition hover:bg-[#008F4C] active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {converting ? "Converting…" : "Convert"}
              </button>
            </>
          )}
        </section>

        {result && (
          <section className="mt-6 rounded-2xl border border-emerald-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 text-center shadow-xs">
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {result.amount.toLocaleString()} {result.from} =
            </p>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#00A859] dark:text-emerald-400">
              {result.convertedAmount.toLocaleString()} {result.to}
            </p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              1 {result.from} = {result.rate} {result.to} · as of {result.date}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}