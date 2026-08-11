//compontes/ShareAction.tsx
"use client";

import { useState } from "react";

import { PersonBillResult } from "@/types/bill";
import { generateShareMessage } from "@/lib/generateShareMessage";
import { generateBillPdf } from "@/lib/pdf/BillPdf";

interface ShareActionsProps {
  result: PersonBillResult;
}

export default function ShareActions({
  result,
}: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const message = generateShareMessage(result);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Unable to copy message.");
    }
  };

  const shareOnWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-5">
      <p className="text-sm font-medium text-gray-700">
        Share bill
      </p>

      <div className="mt-3 flex flex-wrap gap-3">
        <button
          onClick={copyMessage}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          {copied ? "Copied ✓" : "Copy message"}
        </button>

        <button
          onClick={shareOnWhatsApp}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Share on WhatsApp
        </button>
        <button
  onClick={() => generateBillPdf(result)}
  className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
>
  Download PDF
</button>
      </div>
    </div>
  );
}