
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
    <footer className="border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5 text-2xl font-extrabold tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 text-base font-bold text-white shadow-md shadow-green-600/25 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                ₹
              </span>
              <span>
                FinPilot
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">
              Nine free financial tools in one place — split bills, calculate
              taxes, EMIs, SIPs, and more, without the spreadsheet math.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              9 tools Free , No sign-up
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tools</h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-green-600 dark:hover:text-green-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-green-600 dark:hover:text-green-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gray-200 dark:bg-neutral-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FinPilot. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition hover:text-gray-700 dark:hover:text-gray-300">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-gray-700 dark:hover:text-gray-300">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-gray-700 dark:hover:text-gray-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}