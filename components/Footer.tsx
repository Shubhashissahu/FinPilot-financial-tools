
// components/Footer.tsx
import Link from "next/link";

const toolLinks = [
  { href: "/split", label: "Bill Splitter" },
  { href: "/currency-converter", label: "Currency Converter" },
  { href: "/tax-calculator", label: "Tax Calculator" },
  { href: "/ctc-calculator", label: "CTC Calculator" },
  { href: "/emi-calculator", label: "EMI Calculator" },
  { href: "/sip-calculator", label: "SIP Calculator" },
  { href: "/fd-calculator", label: "FD Calculator" },
  { href: "/prepayment-calculator", label: "Prepayment Calculator" },
];

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-sm font-extrabold text-white shadow-xs">
                ₹
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                FinPilot
              </span>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Simple financial tools for everyday decisions. Calculate taxes, EMIs, SIP compounding, and split bills — fast, free, and private.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 px-3 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              13+ Tools · 100% Free · No Sign-up
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tools
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h3>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200/70 dark:border-neutral-800/80" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FinPilot. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition hover:text-slate-800 dark:hover:text-slate-200">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-slate-800 dark:hover:text-slate-200">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-slate-800 dark:hover:text-slate-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}