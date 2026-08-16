# FinanceKit

Your personal finance toolkit — bill splitting, tax planning, loan and investment calculators, and expense tracking, all in one fast, private app. No sign-up required.

## Features

### 🧾 Bill Splitter
Split restaurant bills and shared expenses fairly.
- Manual item entry with per-person or "shared by everyone" assignment
- **AI receipt scanning** — upload a photo, OCR extracts line items automatically
- GST and tip calculation, proportionally allocated per person
- WhatsApp-ready share messages and per-person / full-bill PDF export

### 💱 Currency Converter
Live exchange rates via the [Frankfurter](https://api.frankfurter.dev) API (European Central Bank data, updated daily, no API key required).

### 🧮 Tax Calculator
Compares FY 2024-25 vs. the current FY 2026-27 New Tax Regime slabs, including Section 87A rebate and marginal relief.

### 💼 CTC Calculator
Breaks down Cost to Company into Basic, HRA, DA, LTA, Special Allowance, and Performance Bonus, then computes EPF, ESI, Professional Tax, and Income Tax to arrive at net take-home pay.

### 🏦 EMI Calculator
Standard reducing-balance loan EMI formula, with a monthly/yearly breakdown and a principal-vs-interest pie chart.

### 📈 SIP Calculator
Month-by-month simulation of a Systematic Investment Plan, including optional annual step-up.

### 🏛️ FD Calculator
Fixed Deposit maturity value using quarterly-compounded interest (the standard convention for Indian banks), including effective annual yield.

### 💰 Expense Tracker
- Categorizes spending into **Essential** (rent, EMI, food, transport, utilities, insurance) and **Discretionary** (shopping, outings)
- Shows Income → Expenses → Available After Expenses at a glance
- Calculates **two emergency fund targets**: Essential-only and Full Lifestyle, each at 3 and 6 months
- Tracks progress toward your emergency fund goal with a live progress bar and time-to-goal projection (in days or months, based on your actual savings rate)

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS
- **OCR:** Tesseract.js (receipt text extraction)
- **AI parsing:** Ollama (local LLM, `llama3.2`) for structuring OCR text into receipt data
- **PDF export:** jsPDF
- **Exchange rates:** Frankfurter API

## Getting Started

### Prerequisites
- Node.js
- [Ollama](https://ollama.com) installed locally, with the model pulled:
  ```bash
  ollama pull llama3.2
  ollama serve
  ```

### Installation
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables
Create a `.env.local` file (optional — these are the defaults):
```
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## Project Structure

```
app/
  page.tsx                 → Landing page
  split/                    → Bill Splitter
  tax-calculator/           → Tax Calculator
  ctc-calculator/           → CTC Calculator
  emi-calculator/           → EMI Calculator
  sip-calculator/           → SIP Calculator
  fd-calculator/            → FD Calculator
  currency-converter/       → Currency Converter
  expense-tracker/          → Expense Tracker
  api/receipt/route.ts      → Receipt OCR + AI parsing endpoint

components/
  Navbar.tsx, Footer.tsx, Hero.tsx
  BillItemForm.tsx, PeopleInput.tsx, TaxTipInput.tsx,
  ReceiptUpload.tsx, PersonBreakdown.tsx, ShareActions.tsx
  PieChart.tsx               → Reusable principal/interest chart

lib/
  tools.ts                  → Single source of truth for the tool list
                               (drives both the Navbar and homepage grid)
  calculateSplit.ts, money.ts
  taxCalculator.ts, ctcCalculator.ts, emiCalculator.ts,
  sipCalculator.ts, fdCalculator.ts, expenseTracker.ts
  ocr.ts, ollama.ts          → Receipt scanning pipeline
  currencyApi.ts
  generateBillPdf.ts, generateEmiPdf.ts, generateFdPdf.ts,
  generateCtcPdf.ts          → PDF export helpers
```

## Notes & Limitations

- Tax and CTC calculators cover the **New Tax Regime only**.
- Professional Tax in the CTC calculator is a simplified flat ₹200/month — actual state-wise slabs vary and aren't individually modeled.
- Currency rates update once daily (not real-time) and cover ~30 major currencies.
- This is a portfolio/personal project — figures are estimates, not financial, tax, or legal advice.

## License

Personal project — not licensed for redistribution.
