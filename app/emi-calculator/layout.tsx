import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator | FinPilot",
  description: "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans. View the detailed amortization schedule.",
};

export default function EmiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
