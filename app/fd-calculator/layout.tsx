import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FD Calculator | FinPilot",
  description: "Calculate your Fixed Deposit (FD) maturity amount and interest earned over time with our simple FD Calculator.",
};

export default function FdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
