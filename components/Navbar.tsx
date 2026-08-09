// components/Navbar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: string;
  category: "Daily" | "Tax" | "Invest";
}

const navItems: NavItem[] = [
  { href: "/split", label: "Bill Splitter", description: "Split restaurant bills", icon: "🧾", category: "Daily" },
  { href: "/currency-converter", label: "Currency Converter", description: "Live exchange rates", icon: "💱", category: "Daily" },
  { href: "/tax-calculator", label: "Tax Calculator", description: "New regime, FY 2026-27", icon: "🧮", category: "Tax" },
  { href: "/ctc-calculator", label: "CTC Calculator", description: "CTC to in-hand", icon: "💼", category: "Tax" },
  { href: "/emi-calculator", label: "EMI Calculator", description: "Loan amortization", icon: "🏦", category: "Invest" },
  { href: "/sip-calculator", label: "SIP Calculator", description: "Mutual fund growth", icon: "📈", category: "Invest" },
  { href: "/fd-calculator", label: "FD Calculator", description: "Fixed deposit maturity", icon: "🏛️", category: "Invest" },
];

const categoryOrder: NavItem["category"][] = ["Daily", "Tax", "Invest"];

const topLinks = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
      </>
    ),
  },
];

interface NavbarProps {
  drawerOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function Navbar({ drawerOpen, onToggle, onClose }: NavbarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!drawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [drawerOpen, onClose]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navItems;
    return navItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = categoryOrder.map((category) => ({
    category,
    items: filteredItems.filter((item) => item.category === category),
  }));

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 ${
          drawerOpen ? "lg:ml-80" : "lg:ml-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <button
            onClick={onToggle}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {drawerOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 text-base font-bold text-white shadow-md shadow-green-600/25 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              ₹
            </div>
            <span className="whitespace-nowrap text-lg font-extrabold tracking-tight text-gray-900">
              Finance<span className="text-green-600">Kit</span>
            </span>
          </Link>

          <nav className="ml-auto flex items-center gap-1 rounded-xl bg-gray-100 p-1">
            {topLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {link.icon}
                  </svg>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {drawerOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-gray-950 text-white shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Just the brand mark here — closing is handled by the single
            hamburger/✕ toggle in the header, so there's only ever one
            close control on screen instead of two. */}
        <Link href="/" onClick={onClose} className="flex items-center gap-2 px-5 pt-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 text-base font-bold text-white">
            ₹
          </div>
          <div>
            <p className="text-base font-bold leading-tight">FinanceKit</p>
            <p className="text-xs text-gray-400">
              {navItems.length} tools · Free forever
            </p>
          </div>
        </Link>

        <div className="px-5 pt-5">
          <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2.5 transition focus-within:border-green-600">
            <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        <nav className="mt-5 flex-1 space-y-6 overflow-y-auto px-5 pb-5">
          {grouped.map(
            ({ category, items }) =>
              items.length > 0 && (
                <div key={category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {category}
                  </p>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition ${
                            isActive ? "bg-gray-800 ring-1 ring-green-600/40" : "hover:bg-gray-900"
                          }`}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-lg">
                            {item.icon}
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-white">
                              {item.label}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {item.description}
                            </span>
                          </span>
                          {isActive && (
                            <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )
          )}

          {filteredItems.length === 0 && (
            <p className="text-sm text-gray-500">No tools match &ldquo;{query}&rdquo;.</p>
          )}
        </nav>

        <div className="border-t border-gray-800 px-5 py-4 text-center text-xs text-gray-500">
          Free forever · No sign-up · No data stored
        </div>
      </div>
    </>
  );
}