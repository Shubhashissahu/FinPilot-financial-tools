"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BackButton from "@/components/BackButton";

const MIN_PROPERTY_VALUE = 1000000;
const MAX_PROPERTY_VALUE = 100000000;
const MIN_DOWN_PAYMENT = 100000;
const MAX_DOWN_PAYMENT = 10000000;
const MIN_RATE = 5;
const MAX_RATE = 15;
const MIN_TENURE = 5;
const MAX_TENURE = 30;
const MIN_RENT = 5000;
const MAX_RENT = 200000;

function formatCompact(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

type YearData = {
  year: number;
  propertyValue: number;
  remainingLoan: number;
  buyingNetWorth: number;
  rentingNetWorth: number;
};

export default function RentVsBuyPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(150000);
  const [propertyValue, setPropertyValue] = useState(10000000);
  const [monthlyEmi, setMonthlyEmi] = useState(78641);
  const [downPayment, setDownPayment] = useState(2000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(35000);

  const getEmiFactor = (r: number, y: number) => {
    const mr = r / 1200, tm = y * 12;
    return (mr * Math.pow(1 + mr, tm)) / (Math.pow(1 + mr, tm) - 1);
  };

  const calculateEmiFromProperty = (p: number, dp: number, r: number, y: number) => {
    const loan = Math.max(0, p - dp);
    return loan === 0 ? 0 : loan * getEmiFactor(r, y);
  };

  const calculatePropertyFromEmi = (e: number, dp: number, r: number, y: number) => {
    return e === 0 ? dp : (e / getEmiFactor(r, y)) + dp;
  };

  const handlePropertyChange = (val: number) => {
    setPropertyValue(val);
    setMonthlyEmi(Math.round(calculateEmiFromProperty(val, downPayment, interestRate, tenureYears)));
  };

  const handleEmiChange = (val: number) => {
    setMonthlyEmi(val);
    setPropertyValue(Math.round(calculatePropertyFromEmi(val, downPayment, interestRate, tenureYears)));
  };

  const handleDownPaymentChange = (val: number) => {
    setDownPayment(val);
    // Keep property value fixed, adjust EMI
    setMonthlyEmi(Math.round(calculateEmiFromProperty(propertyValue, val, interestRate, tenureYears)));
  };

  const handleInterestRateChange = (val: number) => {
    setInterestRate(val);
    setMonthlyEmi(Math.round(calculateEmiFromProperty(propertyValue, downPayment, val, tenureYears)));
  };

  const handleTenureChange = (val: number) => {
    setTenureYears(val);
    setMonthlyEmi(Math.round(calculateEmiFromProperty(propertyValue, downPayment, interestRate, val)));
  };

  const result = useMemo(() => {
    const loanAmount = Math.max(0, propertyValue - downPayment);
    const monthlyRate = interestRate / 12 / 100;

    // Rent vs Buy Comparison Over Time
    const propertyAppreciationRate = 0.05;
    const rentIncreaseRate = 0.05;
    const investmentReturnRate = 0.10 / 12; // monthly

    let investmentPortfolio = downPayment;
    let currentRent = monthlyRent;
    let loanBalance = loanAmount;

    let totalRentPaid = 0;
    let totalEmiPaid = 0;

    const yearlyData: YearData[] = [];
    
    // Year 0
    yearlyData.push({
      year: 0,
      propertyValue: propertyValue,
      remainingLoan: loanAmount,
      buyingNetWorth: propertyValue - loanAmount,
      rentingNetWorth: investmentPortfolio
    });

    for (let year = 1; year <= tenureYears; year++) {
      // 12 months simulation
      for (let month = 1; month <= 12; month++) {
        totalRentPaid += currentRent;
        totalEmiPaid += monthlyEmi;

        // Renting
        const difference = monthlyEmi - currentRent;
        investmentPortfolio = investmentPortfolio * (1 + investmentReturnRate) + difference;

        // Buying - Loan reduction
        const interestPaid = loanBalance * monthlyRate;
        const principalPaid = monthlyEmi - interestPaid;
        loanBalance = Math.max(0, loanBalance - principalPaid);
      }
      
      // End of year updates
      currentRent *= (1 + rentIncreaseRate);
      const currentPropertyValue = propertyValue * Math.pow(1 + propertyAppreciationRate, year);
      
      yearlyData.push({
        year,
        propertyValue: Math.round(currentPropertyValue),
        remainingLoan: Math.round(loanBalance),
        buyingNetWorth: Math.round(currentPropertyValue - loanBalance),
        rentingNetWorth: Math.round(investmentPortfolio)
      });
    }

    const finalYear = yearlyData[yearlyData.length - 1];
    const buyNetWorth = finalYear.buyingNetWorth;
    const rentNetWorth = finalYear.rentingNetWorth;

    return {
      monthlyEmi,
      loanAmount,
      propertyValue,
      buyNetWorth,
      rentNetWorth,
      totalRentPaid,
      totalEmiPaid,
      isBetterToBuy: buyNetWorth > rentNetWorth,
      yearlyData
    };
  }, [propertyValue, downPayment, interestRate, tenureYears, monthlyRent]);

  return (
    <main className="min-h-screen bg-[#F7FAF8] dark:bg-[#0a0a0a] px-4 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <BackButton />
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Rent vs Buy Calculator
        </h1>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Calculate your home loan affordability and compare renting vs buying net worth.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Inputs Section */}
          <section className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Financial Details</h2>
            <div className="mt-2 border-t border-gray-100 dark:border-gray-800/50" />

            <SliderField label="Monthly Income" value={monthlyIncome} display={formatCompact(monthlyIncome)} min={30000} max={1000000} step={5000} minLabel="₹30K" maxLabel="₹10L" onChange={setMonthlyIncome} />
            <SliderField label="Property Value" value={propertyValue} display={formatCompact(propertyValue)} min={1000000} max={100000000} step={100000} minLabel="₹10L" maxLabel="₹10Cr" onChange={handlePropertyChange} />
            <SliderField label="Monthly EMI" value={monthlyEmi} display={`₹${monthlyEmi.toLocaleString("en-IN")}`} min={5000} max={1000000} step={1000} minLabel="₹5K" maxLabel="₹10L" onChange={handleEmiChange} />
            
            {monthlyEmi > monthlyIncome * 0.5 && (
              <div className="mt-2 text-xs font-medium text-amber-500">
                ⚠️ This EMI is more than 50% of your Monthly Income.
              </div>
            )}

            <SliderField label="Down Payment" value={downPayment} display={formatCompact(downPayment)} min={0} max={propertyValue} step={50000} minLabel="₹0" maxLabel={formatCompact(propertyValue)} onChange={handleDownPaymentChange} />
            <SliderField label="Interest Rate" value={interestRate} display={`${interestRate}%`} min={5} max={15} step={0.1} minLabel="5%" maxLabel="15%" onChange={handleInterestRateChange} />
            <SliderField label="Loan Tenure" value={tenureYears} display={`${tenureYears} ${tenureYears === 1 ? "year" : "years"}`} min={5} max={30} step={1} minLabel="5 yrs" maxLabel="30 yrs" onChange={handleTenureChange} />
            <SliderField label="Current Monthly Rent" value={monthlyRent} display={`₹${monthlyRent.toLocaleString("en-IN")}`} min={5000} max={200000} step={1000} minLabel="₹5K" maxLabel="₹2L" onChange={setMonthlyRent} />
          </section>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Loan Amount" value={result.loanAmount} tone="green" />
              <StatCard label="Monthly EMI" value={result.monthlyEmi} tone="amber" />
            </div>

            <section className="rounded-2xl bg-white dark:bg-[#1a1d24] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Rent vs Buy Comparison
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#2a2d36]">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Rent ({tenureYears} years)</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">{formatCompact(result.totalRentPaid)}</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#2a2d36]">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total EMI Paid</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCompact(result.totalEmiPaid)}</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#2a2d36]">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Property Value (after {tenureYears} yrs) <span className="text-amber-500">*</span></span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCompact(result.yearlyData[result.yearlyData.length - 1].propertyValue)}</span>
                </div>
              </div>
              
              <div className="mt-2 text-right">
                <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">
                  * Property appreciation highly depends on location. (Assumed 5% here)
                </span>
              </div>
              
              <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold ${result.isBetterToBuy ? 'bg-green-100 dark:bg-[#14261c] text-green-800 dark:text-white' : 'bg-amber-100 dark:bg-[#2e2011] text-amber-900 dark:text-white'}`}>
                {result.isBetterToBuy ? (
                  `Buying is better! You save ${formatCompact(Math.abs(result.buyNetWorth - result.rentNetWorth))}` 
                ) : (
                  <div>
                    <div>Renting is better! You save {formatCompact(Math.abs(result.buyNetWorth - result.rentNetWorth))}</div>
                    <div className="mt-2 text-xs font-normal opacity-80 leading-relaxed text-amber-900/80 dark:text-orange-200/80">
                      Even though the property value increases significantly, aggressively investing the monthly savings (EMI minus Rent) into the market at 10% returns outpaces the 5% property appreciation!
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Chart Section */}
        <section className="mt-6 rounded-2xl bg-white dark:bg-[#1a1d24] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Net Worth Projection (₹)</h2>
          <div className="mt-2 border-t border-gray-100 dark:border-gray-800/50 mb-6" />
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={result.yearlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis 
                  dataKey="year" 
                  stroke="#9ca3af"
                  tickFormatter={(value) => `Year ${value}`}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip 
                  formatter={(value: unknown) => [`₹${Number(value).toLocaleString("en-IN")}`, undefined]}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Line type="monotone" name="Buying Net Worth" dataKey="buyingNetWorth" stroke="#16a34a" strokeWidth={3} dot={false} />
                <Line type="monotone" name="Renting Net Worth" dataKey="rentingNetWorth" stroke="#d97706" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Breakdown table */}
        <section className="mt-6 rounded-2xl bg-white dark:bg-[#1a1d24] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Yearly Breakdown</h2>
          <div className="mt-2 border-t border-gray-100 dark:border-gray-800/50" />

          <div className="mt-2 max-h-[420px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-[#1a1d24]">
                <tr className="border-b border-gray-100 dark:border-gray-800/50 text-left">
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Year</th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Property Value</th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Remaining Loan</th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Buying Net Worth</th>
                  <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Renting Net Worth</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyData.map((row) => (
                  <tr key={row.year} className="border-b border-gray-50 dark:border-neutral-800/50">
                    <td className="py-3 text-gray-700 dark:text-gray-300">Year {row.year}</td>
                    <td className="py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                      {row.propertyValue.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right font-semibold text-red-500/80">
                      {row.remainingLoan.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right font-semibold text-green-600 dark:text-green-400">
                      {row.buyingNetWorth.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                      {row.rentingNetWorth.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Calculation Logic Section */}
        <section className="mt-6 rounded-2xl bg-white dark:bg-[#1a1d24] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">How This Works (In Simple Terms)</h2>
          <div className="mt-2 border-t border-gray-100 dark:border-gray-800/50 mb-4" />
          
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">1. If you Buy</h3>
              <p>You pay your Down Payment upfront, and then your EMI every month. We assume your property value grows by 5% every year. By the end, your total wealth is simply the final value of the house, minus any loan you still owe.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">2. If you Rent</h3>
              <p>You pay Rent instead of EMI. We assume rent increases by 5% every year. What happens to your Down Payment? You invest it! What happens if your Rent is less than your EMI? You invest the difference every single month! We assume your investments grow by 10% every year. By the end, your total wealth is the final value of your investment portfolio.</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

function SliderField({
  label,
  value,
  display,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-6 first:mt-6">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </label>
        <span className="text-sm font-bold text-green-700">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-green-600"
      />
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "green" | "amber" | "blue" }) {
  const styles = {
    green: { bg: "bg-green-50 dark:bg-green-900/20", label: "text-green-700 dark:text-green-400", value: "text-green-700 dark:text-green-400" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", label: "text-amber-700 dark:text-amber-300", value: "text-amber-600 dark:text-amber-300" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", label: "text-blue-700 dark:text-blue-300", value: "text-blue-700 dark:text-blue-300" },
  }[tone];

  return (
    <div className={`rounded-2xl p-4 ${styles.bg}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${styles.label}`}>
        {label}
      </p>
      <p className={`mt-1 text-xl font-black ${styles.value}`}>
        ₹{Math.round(value).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
