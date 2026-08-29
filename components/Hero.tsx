// components/Hero.tsx
"use client";

import Link from "next/link";
import { tools, categoryOrder, categoryLabels } from "@/lib/tools";
import { Calculator, ShieldCheck, Zap, Lock, Sparkles, Database, ArrowRight } from "lucide-react";

const trustPoints = [
  {
    icon: "🔒",
    title: "Private by default",
    body: "Calculations happen locally. Your financial inputs stay in your browser.",
  },
  {
    icon: "⚡",
    title: "Built for speed",
    body: "No sign-up or unnecessary steps. Open a tool and calculate.",
  },
  {
    icon: "🇮🇳",
    title: "Made for India",
    body: "Lakhs, crores, GST, Indian tax slabs and financial calculations built for Indian users.",
  },
];

export default function Hero() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F7FAF8] dark:bg-[#0a0a0a] pt-10 pb-16 lg:pt-16 lg:pb-20">
        {/* Subtle fintech ambient light wash */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[900px] max-w-full rounded-full bg-gradient-to-b from-emerald-100/60 via-emerald-50/20 to-transparent dark:from-emerald-950/20 dark:via-transparent dark:to-transparent blur-3xl opacity-70" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 dark:border-emerald-800/60 bg-emerald-50/90 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                </span>
                13+ Free Financial Tools
              </div>

              {/* Heading */}
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.12]">
                Your personal{" "}
                <span className="text-[#00A859] dark:text-emerald-400">finance</span>{" "}
                toolkit.
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400 mx-auto lg:mx-0">
                Calculate, plan and manage your money with simple tools built for India.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="#tools"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-6 py-3.5 text-sm font-semibold text-white dark:text-slate-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95"
                >
                  <span>Explore Tools</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tax-calculator"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 active:scale-95"
                >
                  <Calculator className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Try a Calculator</span>
                </Link>
              </div>

              {/* Mini feature chips */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  No sign-up required
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-neutral-700" />
                <span className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  100% Private in browser
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-neutral-700" />
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  New Tax Regime (FY 2026-27)
                </span>
              </div>
            </div>

            {/* Right Column: Fintech Dashboard Widget Preview (Desktop) */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative rounded-2xl border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      ₹
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Financial Pulse</p>
                      <p className="text-[10px] text-slate-400">Live Indian Calculator Preview</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Instant Result
                  </span>
                </div>

                {/* Metric Rows */}
                <div className="mt-4 space-y-3">
                  {/* Tax Result Card */}
                  <div className="rounded-xl border border-slate-100 dark:border-neutral-800/80 bg-slate-50/70 dark:bg-neutral-950/60 p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Tax Under ₹12.75L</span>
                      <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                        ₹0 Tax Liability
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500">Sec 87A Full Rebate</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Save ₹60,000</span>
                    </div>
                  </div>

                  {/* SIP Growth Card */}
                  <div className="rounded-xl border border-slate-100 dark:border-neutral-800/80 bg-slate-50/70 dark:bg-neutral-950/60 p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">SIP (₹10,000 / mo @ 12%)</span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">10 Years</span>
                    </div>
                    <div className="mt-2.5">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Maturity Corpus</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹23,23,391</span>
                      </div>
                      {/* Mini Bar */}
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-neutral-800 overflow-hidden flex">
                        <div className="h-full bg-blue-500 w-[51%]" title="Invested: ₹12L" />
                        <div className="h-full bg-emerald-500 w-[49%]" title="Gains: ₹11.23L" />
                      </div>
                      <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
                        <span>Invested ₹12.0L</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+₹11.2L (93% Gains)</span>
                      </div>
                    </div>
                  </div>

                  {/* Group Split Card */}
                  <div className="rounded-xl border border-slate-100 dark:border-neutral-800/80 bg-slate-50/70 dark:bg-neutral-950/60 p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">Restaurant Bill Split</p>
                      <p className="text-[10px] text-slate-500">4 People · GST & Tip Allocated</p>
                    </div>
                    <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                      Instant PDF
                    </span>
                  </div>
                </div>

                {/* Footer security stamp */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Zero server storage
                  </span>
                  <span className="font-mono text-[10px]">Client-side engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="border-y border-slate-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950/60 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Stat Card 1 */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-[#F7FAF8] dark:bg-neutral-900 p-4 sm:p-5 shadow-2xs transition-all hover:border-emerald-300 dark:hover:border-emerald-500/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  13+
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  Free Tools
                </p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-[#F7FAF8] dark:bg-neutral-900 p-4 sm:p-5 shadow-2xs transition-all hover:border-emerald-300 dark:hover:border-emerald-500/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  ₹0
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  cost
                </p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-[#F7FAF8] dark:bg-neutral-900 p-4 sm:p-5 shadow-2xs transition-all hover:border-emerald-300 dark:hover:border-emerald-500/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  0
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  Data Stored
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS SECTION */}
      <section id="tools" className="bg-[#F7FAF8] dark:bg-[#0a0a0a] py-16 sm:py-20 scroll-mt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Every tool, one place
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Pick a category below, or jump straight to what you need.
            </p>
          </div>

          {/* Categories & Tool Cards */}
          <div className="mt-12 space-y-12">
            {categoryOrder.map((category) => {
              const categoryInfo = categoryLabels[category];
              const items = tools.filter((t) => t.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 px-2.5 items-center justify-center rounded-lg bg-[#00A859] text-xs font-bold text-white shadow-2xs">
                      {categoryInfo.number}
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {categoryInfo.title}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                      — {categoryInfo.desc}
                    </span>
                    <span className="h-px flex-1 bg-slate-200 dark:border-neutral-800" />
                  </div>

                  {/* Cards Grid (3 per row desktop, 2 tablet, 1 mobile) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/80 dark:hover:border-emerald-500/50 hover:shadow-md"
                      >
                        <div>
                          {/* Top: Icon + Arrow */}
                          <div className="flex items-center justify-between">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-neutral-800 text-xl transition-colors duration-200 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-neutral-950">
                              {tool.icon}
                            </span>
                            <span className="text-slate-300 dark:text-neutral-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                              →
                            </span>
                          </div>

                          {/* Tool Name */}
                          <h4 className="mt-4 text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {tool.label}
                          </h4>

                          {/* Description */}
                          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {tool.description}
                          </p>
                        </div>

                        {/* Hover Accent Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] font-medium text-emerald-700 dark:text-emerald-400 opacity-80 group-hover:opacity-100">
                          <span>Open tool</span>
                          <span className="text-xs">↗</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURE / TRUST SECTION */}
      <section className="border-y border-slate-200/80 dark:border-neutral-800/80 bg-[#F1F7F4] dark:bg-neutral-900/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Why people trust FinPilot
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              No accounts, no ads, no data collection — calculators engineered to just work.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs transition-all hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-neutral-800 text-2xl">
                  {point.icon}
                </span>
                <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {point.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA SECTION */}
      <section className="bg-[#F7FAF8] dark:bg-[#0a0a0a] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-emerald-100/50 dark:from-emerald-950/20 dark:to-neutral-900 px-6 py-12 sm:px-12 sm:py-16 text-center shadow-xs">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Make smarter money decisions.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Choose a tool and get your answer in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3.5">
              <Link
                href="#tools"
                className="rounded-xl bg-[#00A859] px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#008F4C] active:scale-95"
              >
                Explore all tools →
              </Link>
              <Link
                href="/tax-calculator"
                className="rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 active:scale-95"
              >
                Calculate tax
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
