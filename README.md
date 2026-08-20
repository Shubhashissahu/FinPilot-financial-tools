# FinPilot (AI Bill Splitter)

FinPilot is a comprehensive suite of personal finance and daily utility tools built with Next.js. It features an AI-powered receipt scanner, tax calculators, investment planners, and more—all wrapped in a modern, responsive UI with dark mode support.

## 🌟 Features

- **AI Bill Splitter**: Upload a receipt, and let OCR (Tesseract.js) and AI (Ollama/OpenAI) automatically parse the items to split the bill among friends easily.
- **Tax & Salary Calculators**: Calculate your income tax (New Regime, FY 2026-27) and break down your CTC to estimate in-hand salary.
- **Investment Calculators**: Plan your financial future with SIP, EMI, and FD calculators.
- **Daily Utilities**: Track your daily expenses and check live currency exchange rates.
- **Dark Mode Support**: Seamlessly switch between light and dark themes.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI & OCR**: `ollama`, `openai`, `tesseract.js`
- **Icons**: `lucide-react`
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or newer recommended)
- Optional: [Ollama](https://ollama.com/) running locally for local AI inference, or an OpenAI API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shubhashissahu/ai-bill-splitter.git
   cd ai-bill-splitter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and configure your environment variables (e.g., API keys for OpenAI if using the cloud option).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🧰 Available Tools

| Category | Tool | Description |
| :--- | :--- | :--- |
| **Daily** | 🧾 Bill Splitter | Split restaurant bills |
| **Daily** | 💱 Currency Converter | Live exchange rates |
| **Daily** | 💰 Expense Tracker | Income vs. expenses |
| **Tax** | 🧮 Tax Calculator | New regime, FY 2026-27 |
| **Tax** | 💼 CTC Calculator | CTC to in-hand |
| **Invest** | 🏦 EMI Calculator | Loan amortization |
| **Invest** | 📈 SIP Calculator | Mutual fund growth |
| **Invest** | 🏛️ FD Calculator | Fixed deposit maturity |

## 📜 License

This project is licensed under the MIT License.
