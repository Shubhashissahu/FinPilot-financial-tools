import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator | FinPilot",
  description: "Calculate the future value of your Systematic Investment Plan (SIP). See how small monthly investments grow over time through compounding.",
};

export default function SipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
