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
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-green-200/40 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-40 h-[450px] w-[450px] rounded-full bg-emerald-200/40 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f0fdf4 1px, transparent 1px), linear-gradient(to bottom, #f0fdf4 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            {tools.length} tools · Free forever · No data stored
          </span>

          <h1 className="mt-8 text-5xl font-black leading-[1.1] tracking-tight text-gray-900 md:text-6xl">
            Your personal
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              finance toolkit.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Tax, EMI, SIP, GST, bill splitter and more — everything in one
            fast, private tool. No sign-up required.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/split"
              className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              🧾 Try Bill Splitter →
            </Link>
            <Link
              href="/sip-calculator"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              📈 Plan your SIP
            </Link>
            <Link
              href="/tax-calculator"
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:text-green-700"
            >
              🧮 Calculate Tax
            </Link>
          </div>
        </div>

        {/* Stat strip */}
        <div className="relative border-y border-gray-100 bg-gray-50/60">
          <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-gray-200 px-6 py-6 text-center">
            <div>
              <p className="text-2xl font-black text-gray-900">{tools.length}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">Free tools</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">₹0</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">Cost, always</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">0</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">Data stored</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOOL GRID */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Every tool, one place
            </h2>
            <p className="mt-3 text-gray-600">
              Pick a category below, or jump straight to what you need.
            </p>
          </div>

          {categoryOrder.map((category, categoryIndex) => {
            const items = tools.filter((t) => t.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="mt-14 first:mt-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                    {String(categoryIndex + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    {category}
                  </p>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
                    >
                      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white">
                        {tool.icon}
                      </span>
                      <h3 className="relative mt-4 font-semibold text-gray-900 group-hover:text-green-700">
                        {tool.label}
                      </h3>
                      <p className="relative mt-1 text-sm text-gray-500">{tool.description}</p>
                      <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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

      {/* WHY FINANCEKIT — light section now, matching the rest of the page
          instead of a near-black block that clashed with everything above it. */}
      <section className="border-y border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Why people trust FinanceKit
            </h2>
            <p className="mt-3 text-gray-600">
              No accounts, no ads, no data collection — just calculators that work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 hover:border-green-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                  {point.icon}
                </span>
                <h3 className="mt-4 font-semibold text-gray-900">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA — softened from a solid saturated green fill to a
          subtle tinted panel with a green border, so it reads as a call
          to action rather than a jarring color block. */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-14">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Ready to do the math?
            </h2>
            <p className="mt-3 text-gray-600">
              Pick any tool above and get your number in under a minute. No account needed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/tax-calculator"
                className="rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-green-700"
              >
                Start with Tax Calculator →
              </Link>
              <Link
                href="/split"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:text-green-700"
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