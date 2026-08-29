export type ToolCategory = "DAILY" | "TAX" | "INVESTMENT" | "LOANS" | "PLANNING";

export interface Tool {
  href: string;
  label: string;
  description: string;
  icon: string;
  category: ToolCategory;
  highlight?: boolean;
}

// Single source of truth — used by both the Navbar drawer and the homepage
// tool grid, so adding/removing a tool only ever happens in one place.
export const tools: Tool[] = [
  // 01 DAILY
  {
    href: "/split",
    label: "Bill Splitter",
    description: "Split group bills & receipts with friends",
    icon: "🧾",
    category: "DAILY",
  },
  {
    href: "/currency-converter",
    label: "Currency Converter",
    description: "Live foreign exchange rates via ECB",
    icon: "💱",
    category: "DAILY",
  },
  {
    href: "/expense-tracker",
    label: "Expense Tracker",
    description: "Track monthly cashflow & emergency fund",
    icon: "💰",
    category: "DAILY",
  },

  // 02 TAX
  {
    href: "/tax-calculator",
    label: "Tax Calculator",
    description: "Estimate your income tax (New Regime FY 2026-27)",
    icon: "🧮",
    category: "TAX",
    highlight: true,
  },
  {
    href: "/ctc-calculator",
    label: "CTC Calculator",
    description: "Convert CTC package to monthly in-hand salary",
    icon: "💼",
    category: "TAX",
  },
  {
    href: "/gst-calculator",
    label: "GST Calculator",
    description: "Calculate inclusive and exclusive GST rates",
    icon: "📊",
    category: "TAX",
  },

  // 03 INVESTMENT
  {
    href: "/sip-calculator",
    label: "SIP Calculator",
    description: "Mutual fund growth & wealth compounding",
    icon: "📈",
    category: "INVESTMENT",
    highlight: true,
  },
  {
    href: "/nps-calculator",
    label: "NPS Calculator",
    description: "Retirement pension & lump sum corpus planner",
    icon: "👴",
    category: "INVESTMENT",
  },
  {
    href: "/fd-calculator",
    label: "FD Calculator",
    description: "Fixed deposit maturity & quarterly interest yield",
    icon: "🏛️",
    category: "INVESTMENT",
  },

  // 04 LOANS
  {
    href: "/emi-calculator",
    label: "EMI Calculator",
    description: "Monthly loan installment & amortization schedule",
    icon: "🏦",
    category: "LOANS",
  },
  {
    href: "/prepayment-calculator",
    label: "Prepayment Calculator",
    description: "Save interest & shorten loan tenure with prepayments",
    icon: "⏱️",
    category: "LOANS",
  },

  // 05 PLANNING
  {
    href: "/rent-vs-buy",
    label: "Rent vs Buy",
    description: "Compare home buying vs renting & investing wealth",
    icon: "🏠",
    category: "PLANNING",
  },
  {
    href: "/savings-goal-calculator",
    label: "Savings Goal",
    description: "Calculate required monthly savings & target timeline",
    icon: "🎯",
    category: "PLANNING",
  },
];

export const categoryOrder: ToolCategory[] = [
  "DAILY",
  "TAX",
  "INVESTMENT",
  "LOANS",
  "PLANNING",
];

export const categoryLabels: Record<ToolCategory, { number: string; title: string; desc: string }> = {
  DAILY: { number: "01", title: "DAILY", desc: "Everyday money management & expense splitting" },
  TAX: { number: "02", title: "TAX", desc: "Income tax, CTC breakdown & GST calculations" },
  INVESTMENT: { number: "03", title: "INVESTMENT", desc: "SIP compounding, NPS retirement & FD growth" },
  LOANS: { number: "04", title: "LOANS", desc: "EMI estimates & smart loan prepayment strategies" },
  PLANNING: { number: "05", title: "PLANNING", desc: "Real estate affordability & target milestone goals" },
};