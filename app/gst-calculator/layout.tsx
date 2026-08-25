import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Calculator | FinPilot",
  description: "Calculate GST amount and original price based on inclusive or exclusive tax rates.",
};

export default function GstCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
