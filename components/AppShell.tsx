"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {

  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <>
      <Navbar drawerOpen={drawerOpen} onToggle={() => setDrawerOpen((v) => !v)} onClose={() => setDrawerOpen(false)} />

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          drawerOpen ? "lg:ml-80" : "lg:ml-0"
        }`}
      >
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
}