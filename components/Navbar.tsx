// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tax-calculator", label: "Tax Calculator" },
  { href: "/emi-calculator", label: "EMI Calculator" },
  { href:"/fd-calculator", label: "FD Calculator" },
  { href:"/currency-converter", label: "currency-converter" },

];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 text-lg font-bold text-white shadow-md shadow-green-600/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            S
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
              Split<span className="text-green-600">Easy</span>
            </h1>
            <p className="text-xs font-medium text-gray-500">
              Smart bill splitting
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-green-700"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-[1px] h-0.5 rounded-full bg-green-600 transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}

          <Link
            href="/split"
            className="ml-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/35 active:translate-y-0"
          >
            Start Splitting →
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200/70 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/split"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-green-600/25"
            >
              Start Splitting →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}