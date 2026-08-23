//lib/ocr
import { createWorker, Worker, RecognizeResult } from "tesseract.js";
import path from "path";

let workerPromise: Promise<Worker> | null = null;

async function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createWorker("eng", 1, {
      // Confirmed to exist at:
      // D:\project\ai-bill-splitter\node_modules\tesseract.js\src\worker-script\node\index.js
      // tesseract.js's automatic resolution breaks under Next.js's dev
      // server (both webpack and Turbopack), so we point it here explicitly.
      workerPath: path.join(
        process.cwd(),
        "node_modules",
        "tesseract.js",
        "src",
        "worker-script",
        "node",
        "index.js"
      ),
    }).catch((err) => {
      workerPromise = null; // don't cache a failed init forever
      throw err;
    });
  }
  return workerPromise;
}

export async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const worker = await getWorker();
  
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("OCR took too long and timed out. Try a simpler or smaller image.")), 30000)
  );

  const { data } = (await Promise.race([
    worker.recognize(buffer),
    timeoutPromise,
  ])) as RecognizeResult;


  const text = data.text?.trim();
  if (!text) {
    throw new Error(
      "Couldn't read any text from that image. Try a clearer, well-lit photo of the receipt."
    );
  }
  return text;
}