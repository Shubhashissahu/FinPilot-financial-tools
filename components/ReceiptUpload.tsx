// components/ReceiptUpload.tsx

"use client";

import { useState } from "react";
import { BillItem, ExtractedReceipt } from "@/types/bill";

interface ReceiptUploadProps {
  items: BillItem[];
  setItems: React.Dispatch<React.SetStateAction<BillItem[]>>;
  setGst: React.Dispatch<React.SetStateAction<number>>;
  onBillChange: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function ReceiptUpload({
  items,
  setItems,
  setGst,
  onBillChange,
}: ReceiptUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Only JPEG, PNG, or WebP images are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError("File size must be less than 5MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };


  const analyzeReceipt = async () => {
    if (!file) {
      setError("Select a receipt image.");
      return;
    }

    if (items.length > 0) {
      const proceed = window.confirm(
        "This will replace your current items with what's found on the receipt. Continue?"
      );

      if (!proceed) return;
    }


    try {
      setIsAnalyzing(true);
      setError("");

      const formData = new FormData();
      formData.append("receipt", file);


      const response = await fetch("/api/receipt", {
        method: "POST",
        body: formData,
      });


      let data: unknown;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server sent an invalid response."
        );
      }


      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Unable to analyze receipt.";

        throw new Error(message);
      }


      if (
        typeof data !== "object" ||
        data === null ||
        !Array.isArray((data as ExtractedReceipt).items)
      ) {
        throw new Error(
          "Invalid receipt data received."
        );
      }


      const receipt = data as ExtractedReceipt;


      const extractedItems: BillItem[] =
        receipt.items.flatMap((item) =>
          Array.from({ length: item.quantity }, () => ({
            id: crypto.randomUUID(),
            name: item.name,
            price: item.price,
            assignedTo: [],
            isShared: false,
          }))
        );


      if (extractedItems.length === 0) {
        throw new Error(
          "No items found. Try uploading a clearer image."
        );
      }


      setItems(extractedItems);
      setGst(receipt.gstPercentage ?? 0);
      onBillChange();


    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze receipt."
      );

    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <section className="mt-10 rounded-2xl border border-green-200 bg-green-50 dark:bg-[#0a0a0a] p-6">

      <span className="text-sm font-medium text-green-700">
        AI Receipt Scanner
      </span>


      <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
        Upload your receipt
      </h2>


      <label
        htmlFor="receipt-upload"
        className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-300 bg-white dark:bg-neutral-900 px-6 py-8 text-center transition hover:border-green-600"
      >
        <span className="text-4xl">📷</span>

        <span className="mt-3 font-medium text-gray-800">
          Choose receipt image
        </span>

        <span className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
          JPEG, PNG or WebP (max 5MB)
        </span>


        {file && (
          <span className="mt-3 text-sm text-green-600">
            Selected: {file.name}
          </span>
        )}

      </label>


      <input
        id="receipt-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />


      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
        We&rsquo;ll extract the bill items automatically.
      </p>


      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}


      <button
        type="button"
        onClick={analyzeReceipt}
        disabled={!file || isAnalyzing}
        className="mt-5 w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAnalyzing
          ? "Analyzing receipt..."
          : "Analyze with AI"}
      </button>

    </section>
  );
}