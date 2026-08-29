"use client";

import { useState, useMemo } from "react";
import { calculateNps, formatCurrency } from "@/lib/calculators/nps";
import BackButton from "@/components/BackButton";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function NpsCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturnPercent, setExpectedReturnPercent] = useState(10);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [annuityPercent, setAnnuityPercent] = useState(40);
  const [annuityRatePercent, setAnnuityRatePercent] = useState(6);

  const result = useMemo(
    () =>
      calculateNps(
        monthlyInvestment,
        expectedReturnPercent,
        currentAge,
        retirementAge,
        annuityPercent,
        annuityRatePercent
      ),
    [
      monthlyInvestment,
      expectedReturnPercent,
      currentAge,
      retirementAge,
      annuityPercent,
      annuityRatePercent,
    ]
  );

  const chartData = [
    { name: "Lump sum value", value: result.lumpSumValue, color: "#4f46e5" }, // indigo-600
    { name: "Annuity Value", value: result.annuityValue, color: "#16a34a" }, // green-600
  ];

  return (
    <main className="min-h-screen bg-[#F7FAF8] dark:bg-[#0a0a0a] px-4 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <BackButton />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">NPS Calculator</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          National Pension System · Plan your retirement corpus and pension
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* LEFT: inputs */}
          <section className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="font-semibold text-gray-900 dark:text-white">Investment details</h2>

            <InputField
              label="Monthly Investment"
              value={monthlyInvestment}
              min={500}
              max={150000}
              onChange={setMonthlyInvestment}
              prefix="₹"
            />

            <InputField
              label="Expected Return (%)"
              value={expectedReturnPercent}
              min={8}
              max={15}
              onChange={setExpectedReturnPercent}
              suffix="%"
            />

            <InputField
              label="Current Age"
              value={currentAge}
              min={18}
              max={65}
              onChange={setCurrentAge}
              suffix="yrs"
            />

            <InputField
              label="Retirement Age"
              value={retirementAge}
              min={Math.max(18, currentAge + 1)}
              max={75}
              onChange={setRetirementAge}
              suffix="yrs"
            />

            <InputField
              label="Annuity Percentage (%)"
              value={annuityPercent}
              min={40}
              max={100}
              onChange={setAnnuityPercent}
              suffix="%"
            />

            <InputField
              label="Expected Annuity Rate (%)"
              value={annuityRatePercent}
              min={5}
              max={12}
              onChange={setAnnuityRatePercent}
              suffix="%"
            />
          </section>

          {/* RIGHT: results */}
          <div className="space-y-6">
            {/* Equation Header */}
            <section className="rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm flex items-center justify-between text-center overflow-x-auto gap-4">
              <div className="flex-shrink-0">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(result.totalInvested)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You invested</p>
              </div>
              <div className="text-gray-400 font-bold flex-shrink-0">+</div>
              <div className="flex-shrink-0">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(result.interestEarned)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Interest earned</p>
              </div>
              <div className="text-gray-400 font-bold flex-shrink-0">=</div>
              <div className="flex-shrink-0">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(result.maturityAmount)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maturity amount</p>
              </div>
            </section>

            {/* Split Chart and Values */}
            <section className="rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm flex flex-col md:flex-row items-center gap-8">
              {/* Chart */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Maturity Amount</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 break-words">{formatCurrency(result.maturityAmount)}</p>
                </div>
              </div>

              {/* Value boxes */}
              <div className="flex-1 space-y-4 w-full">
                <div className="border border-gray-100 dark:border-neutral-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-l-indigo-600 dark:border-l-indigo-500 gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Lump sum value</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(result.lumpSumValue)}</span>
                </div>

                <div className="border border-gray-100 dark:border-neutral-800 rounded-lg p-4 border-l-4 border-l-green-600 dark:border-l-green-500 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Annuity Value</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(result.annuityValue)}</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-neutral-800 pt-3 flex items-center gap-3">
                    <div className="w-[2px] h-5 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Monthly Pension</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white ml-auto">{formatCurrency(result.monthlyPension)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Informational Content */}
        <div className="mt-16 space-y-16">
          {/* What is NPS and Formula */}
          <section>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What is NPS?</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  NPS stands for National Pension Scheme. As the name suggests, it is a scheme via which Indians can secure their finances post-retirement. It aims to help you grow your corpus via small monthly investments that won&apos;t burn a hole in your pocket. Anyone between the ages of 18 and 60 can invest in the NPS given that they comply with the KYC guidelines.
                </p>
              </div>
              <div className="hidden md:flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full bg-[#fdece7] dark:bg-orange-900/20 text-6xl shadow-inner border border-orange-100 dark:border-neutral-800">
                🛡️
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#faf9f6] dark:bg-neutral-900/50 border border-[#f0ede6] dark:border-neutral-800 p-8 text-center space-y-4 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Formula for NPS calculation in India is <span className="text-[#d83c31] dark:text-red-400 ml-1 font-bold">A = P (1+r/n) ^ nt</span>
              </h3>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-700 dark:text-gray-300 pt-2">
                <span><strong>A</strong> - Total corpus amount at maturity</span>
                <span><strong>P</strong> - Principal sum</span>
                <span><strong>r</strong> - Rate of interest per annum</span>
                <span><strong>n</strong> - Number of times interest is compounded per year</span>
                <span><strong>t</strong> - Time (in years)</span>
              </div>
            </div>
          </section>

          {/* Advantages */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Major advantages of using the NPS calculator</h2>
            <p className="text-gray-600 dark:text-gray-400">Our NPS Calculator can assist you in the following ways:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>It tells you what you can expect on the fund&apos;s maturity so that you can plan your post-retirement life accordingly.</li>
              <li>You don&apos;t have to power through endless numbers manually and formulae to know how much money you&apos;ll get when you can compute it at a single click.</li>
              <li>Know how much you&apos;ll save up on taxes under Section 80 CCD and accordingly plan your tax-savings investment portfolio.</li>
            </ul>
          </section>

          {/* How to use */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How can you calculate pension amount with this tool?</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our free NPS calculator shows you the provisional lump sum and pension amount you get at retirement based on your monthly contributions, annuity purchased, and expected rate of return. Just enter the required data in the relevant fields. Our free NPS calculator will tell you how much you can expect after retirement.
            </p>
            
            <div className="space-y-6 pt-2">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Investment per month:</h3>
                <p className="text-gray-600 dark:text-gray-400">The monthly investment amount you contribute towards your NPS.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Expected return:</h3>
                <p className="text-gray-600 dark:text-gray-400">This is the estimated return you expect to achieve with your NPS investment. It varies based on your investment choice, market conditions, and the performance of the assets.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Age at the time of investment and retirement:</h3>
                <p className="text-gray-600 dark:text-gray-400">Enter the age at which you started investing for NPS and the age at which you plan on retiring.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Annuity:</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Annuity in NPS refers to the pension you will receive every month from the Annuity Service Providers (ASP) after your NPS reaches maturity.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Annuity percentage:</h3>
                <p className="text-gray-600 dark:text-gray-400">This is the percentage of pension wealth you would like to reinvest to purchase an annuity. You can reinvest a minimum of 40% to a maximum of 100% of the corpus to purchase an annuity. Any amount remaining can be withdrawn as a lump sum at the time of retirement.</p>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 p-6 border border-amber-100 dark:border-amber-900/30 mt-8">
              <h4 className="font-bold text-amber-900 dark:text-amber-500 mb-3 text-sm uppercase tracking-wide">Note</h4>
              <ul className="list-disc pl-5 space-y-3 text-sm text-amber-800 dark:text-amber-200/80">
                <li>Users who are subscribed to tier 1 of NPS and wish to exit prematurely (i.e., before the age of 60), must reinvest at least 80%, if the corpus amount at the time of exit is higher than ₹ 2.5 lakh. If it&apos;s lesser than or equal to ₹ 2.5 lakh, the entire corpus can be withdrawn as lump sum.</li>
                <li>Users who are subscribed to tier 2 of NPS, can withdraw funds without any restrictions.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InputField({
  label,
  value,
  min,
  max,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300 block mb-2">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            {prefix}
          </span>
        )}
        <input
          suppressHydrationWarning
          type="number"
          min={min}
          max={max}
          value={value === 0 ? "" : value}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              onChange(0);
            } else {
              onChange(Number(val));
            }
          }}
          className={`block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-neutral-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:bg-neutral-800 dark:text-white sm:text-sm sm:leading-6 ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-9' : 'pr-3'} bg-white`}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
