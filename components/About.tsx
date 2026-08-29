// components/About.tsx
import Link from "next/link";
import { tools } from "@/lib/tools";
import BackButton from "@/components/BackButton";

const values = [
  {
    icon: "🔒",
    title: "Privacy first",
    body: "Every calculation runs entirely in your browser. Nothing you type — income, loan amounts, bill splits — ever touches a server.",
  },
  {
    icon: "🆓",
    title: "Free, no catch",
    body: "No paywalls, no premium tier, no email required. FinPilot stays free because it doesn't cost much to run — there's nothing to store.",
  },
  {
    icon: "🎯",
    title: "Built for accuracy",
    body: "Tax slabs, EPF ceilings, and ESI thresholds are kept current with the latest Indian budget rules — not generic global defaults.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#F7FAF8] dark:bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <BackButton />

        {/* Intro */}
        <section className="relative overflow-hidden text-center pt-6 pb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 dark:border-emerald-800/60 bg-emerald-50/90 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            About FinPilot
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-tight">
            One toolkit,
            <br />
            <span className="text-[#00A859] dark:text-emerald-400">
              built to just work.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            FinPilot started as a simple bill-splitter for friend groups and
            grew into a set of {tools.length} calculators covering tax, loans,
            investments, and everyday money math — all free, all private, all
            in one place.
          </p>
        </section>

        {/* Story */}
        <section className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Why we built this
          </h2>
          <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            <p>
              Splitting a dinner bill shouldn&apos;t need a spreadsheet. Neither
              should figuring out your take-home salary, your EMI, or whether
              this year&apos;s tax slabs actually help you. Most calculators
              online are cluttered with ads, ask for an account, or quietly
              send your numbers somewhere.
            </p>
            <p>
              FinPilot is the opposite: open a tool, type in your numbers,
              get an answer. No sign-up, no data collection, no waiting.
              Every calculator is tuned specifically for how money works in
              India — lakhs and crores, GST slabs, EPF ceilings, and the
              current New Tax Regime.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-center text-slate-900 dark:text-white">
            What we care about
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs transition-all hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-neutral-800 text-2xl">
                  {value.icon}
                </span>
                <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-emerald-100/50 dark:from-emerald-950/20 dark:to-neutral-900 px-6 py-12 text-center shadow-xs">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Try FinPilot for yourself
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {tools.length} tools, zero sign-up. Pick one and see for yourself.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-[#00A859] px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#008F4C] active:scale-95"
              >
                Browse all tools →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}