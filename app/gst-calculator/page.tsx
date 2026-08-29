"use client";

import { useMemo, useState } from "react";
import BackButton from "@/components/BackButton";

export default function GstCalculatorPage() {
  const [amountInput, setAmountInput] = useState("1500");
  const [gstPercent, setGstPercent] = useState(5);
  const [taxType, setTaxType] = useState<"Inclusive" | "Exclusive">("Inclusive");

  const formatInput = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, "");
    if (!digitsOnly) return "";
    return Number(digitsOnly).toLocaleString("en-IN");
  };

  const parseNumeric = (raw: string) => Number(raw.replace(/[^\d]/g, ""));

  const amount = parseNumeric(amountInput);

  const { actualAmount, gstAmount, totalAmount } = useMemo(() => {
    if (!amount || !Number.isFinite(amount) || amount < 0) {
      return { actualAmount: 0, gstAmount: 0, totalAmount: 0 };
    }

    if (taxType === "Inclusive") {
      const actual = amount / (1 + gstPercent / 100);
      const gst = amount - actual;
      return {
        actualAmount: actual,
        gstAmount: gst,
        totalAmount: amount,
      };
    } else {
      const gst = amount * (gstPercent / 100);
      return {
        actualAmount: amount,
        gstAmount: gst,
        totalAmount: amount + gst,
      };
    }
  }, [amount, gstPercent, taxType]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: Number.isInteger(val) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <main className="min-h-screen bg-[#F7FAF8] dark:bg-[#0a0a0a] px-4 sm:px-6 py-10 sm:py-16 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-4xl">
        <BackButton />
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          GST Calculator
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Calculate GST amount and original price based on inclusive or exclusive tax rates.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 md:p-8 shadow-xs backdrop-blur-xs">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Amount
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={(e) => setAmountInput(formatInput(e.target.value))}
                className="w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-gray-900 dark:text-white outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                GST %
              </label>
              <div className="relative">
                <select
                  value={gstPercent}
                  onChange={(e) => setGstPercent(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-gray-900 dark:text-white outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                  <option value={40}>40%</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tax
              </label>
              <div className="relative">
                <select
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value as "Inclusive" | "Exclusive")}
                  className="w-full appearance-none rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 text-gray-900 dark:text-white outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
                >
                  <option value="Inclusive">Inclusive</option>
                  <option value="Exclusive">Exclusive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {amount > 0 && (
          <section className="mt-8 rounded-2xl border border-green-100 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between md:justify-center gap-4 sm:gap-6 md:gap-8 text-center flex-wrap">
              <div className="flex flex-col items-center flex-1 min-w-[140px]">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2 break-all sm:break-normal">
                  ₹{formatCurrency(actualAmount)}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Actual Amount</div>
              </div>

              <div className="text-2xl sm:text-3xl font-medium text-gray-400 dark:text-gray-600 shrink-0">+</div>

              <div className="flex flex-col items-center flex-1 min-w-[140px]">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-green-600 dark:text-green-400 mb-2 break-all sm:break-normal">
                  ₹{formatCurrency(gstAmount)}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">GST Amount</div>
              </div>

              <div className="text-2xl sm:text-3xl font-medium text-gray-400 dark:text-gray-600 shrink-0">=</div>

              <div className="flex flex-col items-center flex-1 min-w-[140px]">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2 break-all sm:break-normal">
                  ₹{formatCurrency(totalAmount)}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Amount</div>
              </div>
            </div>
          </section>
        )}

        <div className="mt-16 pb-12 border-t border-gray-200 dark:border-neutral-800 pt-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            GST - Goods and Services Tax
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            GST or the Goods and Services Tax is an indirect tax that came into effect in India on the 1st of July, 2017. GST is levied on goods and services and has replaced other indirect taxes that were in effect before it came into use.
          </p>

          <h3 className="mt-8 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            More on GST
          </h3>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            GST was implemented primarily to bring uniformity to tax collection. Under the GST regime, tax is collected cumulatively at the final stage of the production of goods or services. As per the GST 2.0 updates, there are four GST slabs—0%, 5%, 18%, and 40% with different goods and services taxed at different rates. Additionally, some goods do not attract GST.
          </p>

          <h3 className="mt-8 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Types of GST Active in India
          </h3>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            Here are four types of GST active in India. They are:
          </p>
          <ul className="mt-4 space-y-4 text-gray-600 dark:text-gray-400 list-disc pl-6 leading-relaxed">
            <li>
              <strong className="text-gray-900 dark:text-gray-200">CGST - Central Goods and Services Tax:</strong> CGST is collected by the central government for intra-state supply of goods and services and is governed by the CGST act. CGST is charged along with SGST with both rates usually equal.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-200">SGST - State Goods and Services Tax:</strong> SGST is collected by the state government for intra-state supply of goods and services and is governed by the SGST act. SGST is charged along with CGST with both rates usually equal.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-200">IGST - Integrated Goods and Services Tax:</strong> IGST is collected by the central government on inter-state supply of goods and services as well as imports. The central government collects the IGST and then distributes it among the respective states.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-200">UTGST - Union Territory Goods and Services Tax:</strong> UTGST is applicable on supply of goods or services that take place in any of the seven union territories in India. The UTGST is collected along with the CGST.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
