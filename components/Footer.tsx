// components/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold shadow-lg shadow-indigo-600/20">
                S
              </span>

              <span>
                Split<span className="text-indigo-400">Easy</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-gray-400">
              Split bills with friends, roommates, and groups without the
              awkward math. Simple, fast, and stress-free.
            </p>

            {/* Mini Trust Badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Built for simple, stress-free splitting
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Bill Splitter
                </Link>
              </li>

              <li>
                <Link
                  href="/calculator"
                  className="transition hover:text-white"
                >
                  Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-white"
                >
                  About SplitEasy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Resources
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/how-it-works"
                  className="transition hover:text-white"
                >
                  How it works
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-white"
                >
                  Privacy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-white"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gray-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} SplitEasy. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-gray-300"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-gray-300"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-gray-300"
            >
              Contact
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}