export interface Tool {
  href: string;
  label: string;
  description: string;
  icon: string;
  category: "Daily" | "Tax" | "Invest";
}

// Single source of truth — used by both the Navbar drawer and the homepage
// tool grid, so adding/removing a tool only ever happens in one place.
export const tools: Tool[] = [
  {
    href: "/split",
    label: "Bill Splitter",
    description: "Split restaurant bills",
    icon: "🧾",
    category: "Daily",
  },
  {
    href: "/currency-converter",
    label: "Currency Converter",
    description: "Live exchange rates",
    icon: "💱",
    category: "Daily",
  },
  {
    href: "/tax-calculator",
    label: "Tax Calculator",
    description: "New regime, FY 2026-27",
    icon: "🧮",
    category: "Tax",
  },
  {
    href: "/ctc-calculator",
    label: "CTC Calculator",
    description: "CTC to in-hand",
    icon: "💼",
    category: "Tax",
  },
  {
    href: "/gst-calculator",
    label: "GST Calculator",
    description: "Inclusive & Exclusive GST",
    icon: "📊",
    category: "Tax",
  },
  {
    href: "/emi-calculator",
    label: "EMI Calculator",
    description: "Loan amortization",
    icon: "🏦",
    category: "Invest",
  },
  {
    href: "/sip-calculator",
    label: "SIP Calculator",
    description: "Mutual fund growth",
    icon: "📈",
    category: "Invest",
  },
  {
    href: "/fd-calculator",
    label: "FD Calculator",
    description: "Fixed deposit maturity",
    icon: "🏛️",
    category: "Invest",
  },
  {
    href: "/rent-vs-buy",
    label: "Rent vs Buy",
    description: "Home loan affordability",
    icon: "🏠",
    category: "Invest",
  },
  {
    href: "/prepayment-calculator",
    label: "Prepayment Calculator",
    description: "Loan payoff strategies",
    icon: "⏱️",
    category: "Invest",
  },
  {
    href: "/savings-goal-calculator",
    label: "Savings Goal",
    description: "Time to reach target",
    icon: "🎯",
    category: "Invest",
  },
  { href: "/expense-tracker", label: "Expense Tracker", description: "Income vs. expenses", icon: "💰", category: "Daily" },
];

export const categoryOrder: Tool["category"][] = ["Daily", "Tax", "Invest"];