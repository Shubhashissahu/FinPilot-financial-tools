//components/hero.tsx
"use client";

import Link from "next/link";
import { tools, categoryOrder } from "@/lib/tools";

const trustPoints = [
  {
    icon: "🔒",
    title: "Nothing leaves your browser",
    body: "Every calculation runs locally. We don't store your income, loan amounts, or bill splits anywhere.",
  },
  {
    icon: "⚡",
    title: "Built for speed",
    body: "No sign-up, no loading screens. Open a tool and get your number in seconds.",
  },
  {
    icon: "🇮🇳",
    title: "Made for Indian numbers",
    body: "Lakhs and crores, GST slabs, the New Tax Regime, EPF ceilings — tuned for how India actually calculates.",
  },
];

export default function Hero() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
        {/* Glow effects for dark mode */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-green-200/40 dark:bg-green-900/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-40 h-[450px] w-[450px] rounded-full bg-emerald-200/40 dark:bg-emerald-900/20 blur-[120px]" />
        
        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #22c55e 1px, transparent 1px), linear-gradient(to bottom, #22c55e 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            {tools.length} tools · Free forever · No data stored
          </span>

          <h1 className="mt-8 text-5xl font-black leading-[1.1] tracking-tight text-gray-900 dark:text-white md:text-6xl">
            Your personal
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              finance toolkit.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400 dark:text-gray-500">
            Tax, EMI, SIP, GST, bill splitter and more — everything in one
            fast, private tool. No sign-up required.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/split"
              className="flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white dark:bg-neutral-900 px-6 py-3.5 font-semibold text-white dark:text-black shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              🧾 Try Bill Splitter →
            </Link>
            <Link
              href="/sip-calculator"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 dark:shadow-green-900/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              📈 Plan your SIP
            </Link>
            <Link
              href="/tax-calculator"
              className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 dark:bg-neutral-900/50 backdrop-blur-md px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-green-400 dark:hover:border-green-500 hover:text-green-700 dark:hover:text-green-400"
            >
              🧮 Calculate Tax
            </Link>
          </div>
        </div>

        {/* Stat strip */}
        <div className="relative border-y border-gray-100 dark:border-neutral-800/50 bg-gray-50 dark:bg-neutral-900/50/60 dark:bg-neutral-900/40 backdrop-blur-md">
          <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-gray-200 dark:divide-neutral-800/80 px-6 py-6 text-center">
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{tools.length}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 dark:text-gray-500">Free tools</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">₹0</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 dark:text-gray-500">Cost, always</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">0</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 dark:text-gray-500">Data stored</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOOL GRID */}
      <section className="bg-white dark:bg-[#0a0a0a] relative">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Every tool, one place
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 dark:text-gray-500">
              Pick a category below, or jump straight to what you need.
            </p>
          </div>

          {categoryOrder.map((category, categoryIndex) => {
            const items = tools.filter((t) => t.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="mt-14 first:mt-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 dark:bg-green-500/20 text-xs font-bold text-white dark:text-green-400">
                    {String(categoryIndex + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    {category}
                  </p>
                  <span className="h-px flex-1 bg-gray-200 dark:bg-neutral-800" />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 dark:bg-neutral-900/40 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 dark:hover:border-green-500/50 hover:shadow-lg dark:hover:bg-neutral-800/80"
                    >
                      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-green-50 dark:bg-green-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 dark:bg-neutral-800 text-xl transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white dark:group-hover:bg-green-500 dark:group-hover:text-neutral-900">
                        {tool.icon}
                      </span>
                      <h3 className="relative mt-4 font-semibold text-gray-900 dark:text-gray-200 group-hover:text-green-700 dark:group-hover:text-white">
                        {tool.label}
                      </h3>
                      <p className="relative mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{tool.description}</p>
                      <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Open tool →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY FINANCEKIT */}
      <section className="border-y border-gray-100 dark:border-neutral-800/50 bg-gray-50 dark:bg-neutral-900/20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Why people trust FinanceKit
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 dark:text-gray-500">
              No accounts, no ads, no data collection — just calculators that work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 dark:bg-neutral-900/40 backdrop-blur-sm p-6 shadow-sm transition-colors duration-300 hover:border-green-300 dark:hover:border-green-500/50 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 dark:bg-neutral-800 text-xl">
                  {point.icon}
                </span>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-200">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 dark:text-gray-500">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-white dark:bg-[#0a0a0a] py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl border border-green-100 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 px-6 py-14">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Ready to do the math?
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 dark:text-gray-500">
              Pick any tool above and get your number in under a minute. No account needed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/tax-calculator"
                className="rounded-xl bg-green-600 dark:bg-green-500 px-6 py-3.5 font-semibold text-white dark:text-neutral-900 shadow-lg shadow-green-600/25 dark:shadow-green-900/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-green-700 dark:hover:bg-green-400"
              >
                Start with Tax Calculator →
              </Link>
              <Link
                href="/split"
                className="rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 dark:bg-neutral-800/50 backdrop-blur-sm px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-green-400 dark:hover:border-green-500 hover:text-green-700 dark:hover:text-green-400"
              >
                Or split a bill
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}