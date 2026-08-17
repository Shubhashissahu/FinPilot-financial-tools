import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Tracker | FinPilot",
  description: "Track your personal expenses, categorize spending, and stay on top of your budget with our simple expense tracker.",
};

export default function ExpenseTrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
