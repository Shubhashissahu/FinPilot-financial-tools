# 💸 FinPilot (AI Bill Splitter & Financial Tools)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**FinPilot** is a comprehensive suite of personal finance and daily utility tools built with Next.js. It features an AI-powered receipt scanner, tax calculators, investment planners, and much more—all wrapped in a modern, responsive UI with seamless dark mode support.

## ✨ Key Features

- **🤖 AI Bill Splitter**: Upload a receipt and let OCR (Tesseract.js) and AI (Ollama/OpenAI) automatically parse the items to split the bill among friends fairly and easily.
- **📊 Comprehensive Financial Calculators**: Plan your financial future with SIP, EMI, FD, NPS, and Savings Goal calculators.
- **💼 Tax & Salary Tools**: Calculate your income tax (New Regime) and break down your CTC to estimate your exact in-hand salary.
- **🏠 Real Estate & Loans**: Evaluate Rent vs. Buy scenarios and analyze loan prepayment benefits.
- **📅 Daily Utilities**: Track your daily expenses and check live currency exchange rates.
- **🌙 Modern UI/UX**: Built with Next.js App Router and Tailwind CSS, featuring full dark mode support and responsive design.

## 🧰 Available Tools

| Category | Tool | Description |
| :--- | :--- | :--- |
| **Daily Utilities** | 🧾 **Bill Splitter** | Split bills using AI receipt scanning |
| **Daily Utilities** | 💱 **Currency Converter** | Check live exchange rates |
| **Daily Utilities** | 💰 **Expense Tracker** | Track daily income and expenses |
| **Tax & Salary** | 🧮 **Tax Calculator** | Income tax calculator (New Regime) |
| **Tax & Salary** | 💼 **CTC Calculator** | CTC to in-hand salary breakdown |
| **Tax & Salary** | 🧾 **GST Calculator** | Calculate inclusive and exclusive GST |
| **Investments** | 📈 **SIP Calculator** | Mutual fund investment growth |
| **Investments** | 🏛️ **FD Calculator** | Fixed deposit maturity amount |
| **Investments** | 👴 **NPS Calculator** | National Pension System retirement planning |
| **Investments** | 🎯 **Savings Goal** | Calculate required savings to reach a target |
| **Loans & Real Estate**| 🏦 **EMI Calculator** | Loan amortization schedule |
| **Loans & Real Estate**| 💳 **Prepayment Calculator**| See loan prepayment impact on EMI/tenure |
| **Loans & Real Estate**| 🏠 **Rent vs Buy** | Financial comparison of renting vs buying a home |

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI & OCR**: `ollama`, `openai`, `tesseract.js`
- **Charts**: `recharts`
- **Icons**: `lucide-react`
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or newer recommended)
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
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

The project is configured with Vitest. To run tests:

```bash
npx vitest
```

## 📜 License

This project is licensed under the [MIT License](LICENSE).
