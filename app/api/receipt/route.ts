//app/api/receipt/route


import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/ocr";
import { extractReceiptFromText } from "@/lib/ollama";
import { ExtractedReceipt } from "@/types/bill";

// tesseract.js needs Node APIs (Buffer, workers) — this will not run on the Edge runtime.
export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = formData.get("receipt");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No receipt image was uploaded." }, { status: 400 });
  }

  // Never trust client-side validation alone — the client checks are just UX,
  // anyone can hit this endpoint directly with any file.
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG and WebP images are allowed." }, { status: 415 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 413 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "That image looks empty — try uploading again." }, { status: 400 });
  }

  try {
    const ocrText = await extractText(file);
    const { restaurantName, items, gstPercentage } = await extractReceiptFromText(ocrText);

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Couldn't find any items on that receipt. Try a clearer, well-lit photo." },
        { status: 422 }
      );
    }

    // subtotal is always computable from items alone, regardless of whether
    // GST was identified — so it's never null in this flow.
    const subtotal = round2(items.reduce((sum, it) => sum + it.price * it.quantity, 0));

    // total, by contrast, genuinely depends on gstPercentage. If GST is
    // unknown we still report a best-effort total (subtotal, i.e. tax
    // untouched) rather than propagating null and forcing the caller to
    // handle a missing total on top of a missing gstPercentage.
    const total = round2(subtotal * (1 + (gstPercentage ?? 0) / 100));

    const receipt: ExtractedReceipt = {
      restaurantName,
      items,
      gstPercentage,
      subtotal,
      total,
    };

    return NextResponse.json(receipt);
  } catch (err) {
    console.error("Receipt analysis failed:", err);
    const message = err instanceof Error ? err.message : "Unable to analyze receipt.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}