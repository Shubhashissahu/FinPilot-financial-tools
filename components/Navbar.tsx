// components/Navbar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools, categoryOrder, categoryLabels } from "@/lib/tools";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    if (!q) return tools;
    return tools.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = categoryOrder.map((category) => ({
    category,
    label: categoryLabels[category],
    items: filteredItems.filter((item) => item.category === category),
  }));

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-slate-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/90 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]" : "shadow-none"
        } ${drawerOpen ? "lg:ml-80" : "lg:ml-0"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={onToggle}
              suppressHydrationWarning
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-white active:scale-95"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {drawerOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-sm font-extrabold text-white shadow-sm shadow-emerald-600/30 transition-transform duration-300 group-hover:scale-105">
                ₹
              </div>
              <div className="flex flex-col">
                <span className="whitespace-nowrap text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  FinPilot
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase leading-tight mt-0.5">
                  Fintech Toolkit
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Navigation & Theme Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <nav className="flex items-center gap-1 rounded-xl border border-slate-200/70 dark:border-neutral-800 bg-slate-100/70 dark:bg-neutral-900 p-1">
              {topLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white text-emerald-700 dark:bg-neutral-800 dark:text-emerald-400 shadow-xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5 shrink-0"
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

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {drawerOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Side Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-900 dark:text-white shadow-xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800/80 px-5 py-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-sm font-bold text-white shadow-xs">
              ₹
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">FinPilot</p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {tools.length} Tools · Free & Private
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-700 dark:hover:text-white transition lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 px-3 py-2 text-slate-900 dark:text-white transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
            <svg className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              suppressHydrationWarning
              placeholder="Search financial tools..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Categorized List */}
        <nav className="mt-4 flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          {grouped.map(
            ({ category, label, items }) =>
              items.length > 0 && (
                <div key={category}>
                  <div className="mb-2 flex items-center gap-2 px-2">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      {label.number}
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {label.title}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                            isActive
                              ? "bg-emerald-50/80 dark:bg-neutral-800/90 text-emerald-900 dark:text-white ring-1 ring-emerald-500/30 font-medium"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-neutral-900"
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-neutral-800 text-base">
                            {item.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-xs sm:text-sm font-semibold">
                              {item.label}
                            </span>
                            <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                              {item.description}
                            </span>
                          </div>
                          {isActive && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )
          )}

          {filteredItems.length === 0 && (
            <p className="px-3 py-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              No tools match &ldquo;{query}&rdquo;.
            </p>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="border-t border-slate-100 dark:border-neutral-800 px-5 py-3 text-center text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-neutral-900/30">
          🇮🇳 Built for Indian Personal Finance
        </div>
      </aside>
    </>
  );
}