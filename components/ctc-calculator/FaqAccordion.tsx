"use client";

import { useState } from "react";

const FAQ_ITEMS: { title: string; body: React.ReactNode }[] = [
  {
    title: "What is Basic Salary?",
    body: "Basic Salary is the fixed core of your pay before allowances. It auto-fills as whatever percentage of your CTC remains after HRA, DA, LTA, Special Allowance, and Performance Bonus are allocated.",
  },
  {
    title: "Understanding HRA",
    body: "House Rent Allowance (HRA) helps employees meet rental expenses. It's typically 40–50% of basic salary for metro cities.",
  },
  {
    title: "Tax Benefits",
    body: "Components like HRA, LTA, and EPF contributions can help reduce your taxable income under some regimes. Consult a tax professional to maximize your benefits.",
  },
  {
    title: "Understanding EPF",
    body: "EPF is commonly calculated on Basic + DA. Some employers cap the monthly PF wage at ₹15,000 (12% = ₹1,800/month), while others contribute on actual wages.",
  },
  {
    title: "Standard Deduction",
    body: (
      <>
        Standard deduction is a flat amount that reduces your taxable income:
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Old Tax Regime: ₹50,000 per year</li>
          <li>New Tax Regime (Tax Year 2026-27): ₹75,000 per year</li>
        </ul>
      </>
    ),
  },
];

export function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState<Set<number>>(new Set([1, 2, 3, 4]));

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
      <div className="mt-10 rounded-2xl bg-blue-50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-blue-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-300 text-sm">?</span>
          Understanding Your CTC
        </h2>
        <p className="mt-3 text-sm text-blue-800">
          Cost to Company (CTC) is the total amount your employer spends on you annually, including all benefits and
          contributions.
        </p>
        <p className="mt-2 text-sm text-blue-800">
          Your take-home salary will be lower than your CTC due to various deductions and the fact that some components
          are non-monetary benefits.
        </p>
      </div>

      <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
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
            {openFaq.has(index) && <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400 dark:text-gray-500">{item.body}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
