import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTC Calculator | FinPilot",
  description: "Estimate your take-home salary from your Cost to Company (CTC). See detailed breakdowns of basic salary, HRA, EPF, and taxes under the New Tax Regime.",
};

export default function CtcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
