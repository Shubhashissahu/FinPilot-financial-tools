"use client";

import { useState } from "react";

const FAQ_ITEMS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Reduce Tenure Strategy",
    body: "By paying a lump sum but keeping your monthly EMI the same, the extra payment directly reduces your principal balance. Since the balance drops, more of each future EMI goes toward principal instead of interest, allowing you to finish your loan earlier and save the maximum amount of interest.",
  },
  {
    title: "Reduce EMI Strategy",
    body: "When you make a lump sum prepayment, you can ask your bank to recalculate your loan over the same remaining tenure. Your monthly payment drops immediately, but you pay interest for longer overall — meaning less total interest saved than the reduce-tenure option. It's best if your goal is lower monthly cash outflow.",
  },
  {
    title: "Recurring Extra Payment",
    body: "Consistently paying a small extra amount every month (e.g., ₹2,000 extra) is extremely effective. It automatically acts as a 'Reduce Tenure' strategy, steadily knocking off months or even years from your loan and saving you significant interest over time.",
  },
  {
    title: "How are savings calculated?",
    body: "The calculator uses the standard reducing-balance EMI formula. We simulate your loan month-by-month. Every time you prepay, your principal drops, which directly reduces the interest charged in the subsequent months. The total interest saved is the difference between the interest you would have paid versus the new simulated interest.",
  },
];

export function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState<Set<number>>(new Set());

  const toggleFaq = (index: number) =>
    setOpenFaq((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

  return (
    <>
      <div className="mt-10 rounded-2xl bg-green-50 dark:bg-green-900/20 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-green-900 dark:text-green-200">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-green-300 dark:border-green-700 text-sm">?</span>
          Understanding Prepayment
        </h2>
        <p className="mt-3 text-sm text-green-800 dark:text-green-300/90">
          Making extra payments toward your loan can save you lakhs in interest and help you become debt-free years earlier.
        </p>
      </div>

      <div className="mt-4 divide-y divide-gray-200 dark:divide-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        {FAQ_ITEMS.map((item, index) => (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => toggleFaq(index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
              aria-expanded={openFaq.has(index)}
            >
              <span className="font-semibold text-gray-900 dark:text-white">{item.title}</span>
              <svg
                className={`h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform ${openFaq.has(index) ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                openFaq.has(index) ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {item.body}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
