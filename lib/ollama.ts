//lib/ollama
import axios from "axios";

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";

export const ollama = axios.create({
  baseURL: OLLAMA_HOST,
  timeout: 60_000, // local LLM generation can be slow, especially on CPU
});

export interface RawExtractedReceipt {
  restaurantName: string | null;
  items: { name: string; price: number; quantity: number }[];
  gstPercentage: number | null;
}

const receiptPrompt = (ocrText: string) => `
You are extracting structured data from OCR text of a restaurant receipt. The OCR is imperfect — expect misread characters, missing spaces, and garbled lines.

Return ONLY a JSON object, no prose, no markdown fences, matching exactly this shape:
{
  "restaurantName": string or null,
  "items": [ { "name": string, "price": number, "quantity": number } ],
  "gstPercentage": number or null
}

Rules:
- "restaurantName" is the business name printed at the top of the receipt. If you can't confidently identify one, use null — do NOT guess or invent a name.
- Extract EVERY single food/product item listed on the receipt. Do not skip items.
- "price" is the price in rupees for the item, as a plain number (no currency symbols, no commas).
- **CRITICAL**: Do NOT confuse product codes, barcodes, or HSN codes (which are usually 6-8 digit integers like 21061000, 19053100) for the price. The actual price is usually a decimal number (e.g., 150.00, 80.00).
- **CRITICAL**: If the receipt is in a tabular format, carefully identify the 'Unit Price', 'Gross Value', or 'Total Value' column for the price. Do NOT extract small numbers from 'Other Charges', 'Discount', or 'Tax' columns (e.g. 1.58, 2.26) as the price.
- "quantity" defaults to 1 if not stated.
- Skip lines that clearly aren't menu items (e.g. "Table No", "GSTIN", "Thank you", subtotal lines).
- "gstPercentage": if a tax/GST % is printed directly, use it. If only a GST amount is printed (not a %), estimate the % from that amount versus the subtotal. If you cannot determine it at all, use null — do NOT assume 0.
- If you find no items, return { "restaurantName": null, "items": [], "gstPercentage": null }.

OCR text:
"""
${ocrText}
"""
`.trim();

export async function extractReceiptFromText(ocrText: string): Promise<RawExtractedReceipt> {
  let response;
  try {
    response = await ollama.post("/api/generate", {
      model: OLLAMA_MODEL,
      prompt: receiptPrompt(ocrText),
      stream: false,
      format: "json", // ask Ollama to constrain output to valid JSON
      options: { temperature: 0 }, // deterministic-ish extraction, not creative writing
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === "ECONNREFUSED") {
        throw new Error(
          `Can't reach Ollama at ${OLLAMA_HOST}. Is "ollama serve" running, and is the model pulled ("ollama pull ${OLLAMA_MODEL}")?`
        );
      }
      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        throw new Error("Ollama request timed out. The model might be too large or the image text too complex.");
      }
    }
    throw new Error(`Ollama request failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  const raw = response.data?.response;
  if (typeof raw !== "string") {
    throw new Error("Ollama returned an unexpected response shape.");
  }

  return parseReceiptJson(raw);
}

function parseReceiptJson(raw: string): RawExtractedReceipt {
  // Even with format: "json", models sometimes wrap output in ```json fences
  // or add a stray sentence — strip those defensively before parsing.
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Couldn't parse the receipt into structured data. Try a clearer photo or re-run.");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("The model's response wasn't a valid object.");
  }
  const obj = parsed as Record<string, unknown>;

  if (!Array.isArray(obj.items)) {
    throw new Error("The model's response didn't include a valid items list.");
  }

  const items = obj.items
    .filter(isNamedRecord)
    .map((it) => ({
      name: it.name.trim(),
      price: toPositiveNumber(it.price),
      quantity: toPositiveInt(it.quantity, 1),
    }))
    .filter((it) => it.price > 0);

  return {
    restaurantName: toNonEmptyStringOrNull(obj.restaurantName),
    items,
    gstPercentage: toNonNegativeNumberOrNull(obj.gstPercentage),
  };
}

// No `any` needed: narrow to a Record first, then check the one field we
// actually care about.
function isNamedRecord(
  value: unknown
): value is Record<string, unknown> & { name: string } {
  if (typeof value !== "object" || value === null) return false;
  const name = (value as Record<string, unknown>).name;
  return typeof name === "string" && name.trim().length > 0;
}

function toPositiveNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function toPositiveInt(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? Math.round(value) : parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Distinct from toPositiveNumber: 0 is a valid, meaningful GST% (some states/
// items are genuinely tax-exempt), so this must not collapse "unparseable"
// and "confirmed zero" into the same value.
function toNonNegativeNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function toNonEmptyStringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}