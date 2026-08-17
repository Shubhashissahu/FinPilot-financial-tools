import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Calculator | FinPilot",
  description: "Calculate your income tax in India under the New vs Old tax regimes. Instantly see which regime saves you more money.",
};

export default function TaxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
