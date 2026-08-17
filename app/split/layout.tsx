import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Bill Splitter | FinPilot",
  description: "Scan your restaurant receipts with AI and easily split the bill among friends. Automatically calculates individual shares, taxes, and tips.",
};

export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
