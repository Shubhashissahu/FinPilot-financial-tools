// app/about/page.tsx
import Link from "next/link";
import { tools } from "@/lib/tools";

const values = [
  {
    icon: "🔒",
    title: "Privacy first",
    body: "Every calculation runs entirely in your browser. Nothing you type — income, loan amounts, bill splits — ever touches a server.",
  },
  {
    icon: "🆓",
    title: "Free, no catch",
    body: "No paywalls, no premium tier, no email required. FinanceKit stays free because it doesn't cost much to run — there's nothing to store.",
  },
  {
    icon: "🎯",
    title: "Built for accuracy",
    body: "Tax slabs, EPF ceilings, and ESI thresholds are kept current with the latest regime rules — not generic global defaults.",
  },
];

export default function About() {
  return (
    <main className="bg-white dark:bg-[#0a0a0a]">
      {/* Intro */}
      <section className="relative overflow-hidden">
        {/* Glow effects for dark mode */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-green-200/40 dark:bg-green-900/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-emerald-200/40 dark:bg-emerald-900/20 blur-[120px]" />
        
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

        <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400">
            About FinanceKit
          </span>

          <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl">
            One toolkit,
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              built to just work.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400 dark:text-gray-500">
            FinanceKit started as a simple bill-splitter for friend groups and
            grew into a set of {tools.length} calculators covering tax, loans,
            investments, and everyday money math — all free, all private, all
            in one place.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-gray-100 dark:border-neutral-800/50 bg-gray-50 dark:bg-neutral-900/50/60 dark:bg-neutral-900/20 backdrop-blur-md py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Why we built this
          </h2>
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
            <p>
              Splitting a dinner bill shouldn&apos;t need a spreadsheet. Neither
              should figuring out your take-home salary, your EMI, or whether
              this year&apos;s tax slabs actually help you. Most calculators
              online are cluttered with ads, ask for an account, or quietly
              send your numbers somewhere.
            </p>
            <p>
              FinanceKit is the opposite: open a tool, type in your numbers,
              get an answer. No sign-up, no data collection, no waiting.
              Every calculator is tuned specifically for how money works in
              India — lakhs and crores, GST slabs, EPF ceilings, and the
              current New Tax Regime.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              What we care about
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 dark:bg-neutral-900/40 backdrop-blur-sm p-6 shadow-sm transition-colors duration-300 hover:border-green-300 dark:hover:border-green-500/50 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 dark:bg-neutral-800 text-xl">
                  {value.icon}
                </span>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-200">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 dark:text-gray-500">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 dark:border-neutral-800/50 bg-gray-50 dark:bg-[#0a0a0a] py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl border border-green-100 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 px-6 py-14">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Try FinanceKit for yourself
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 dark:text-gray-500">
              {tools.length} tools, zero sign-up. Pick one and see for yourself.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="rounded-xl bg-green-600 dark:bg-green-500 px-6 py-3.5 font-semibold text-white dark:text-neutral-900 shadow-lg shadow-green-600/25 dark:shadow-green-900/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-green-700 dark:hover:bg-green-400"
              >
                Browse all tools →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}