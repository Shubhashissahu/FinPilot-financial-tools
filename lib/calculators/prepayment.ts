import { calculateEmi } from "./emi";

export interface PrepaymentResult {
  originalEmi: number;
  originalTotalInterest: number;
  originalTenureMonths: number;

  newEmi: number;
  newTotalInterest: number;
  newTenureMonths: number;

  interestSaved: number;
  tenureSavedMonths: number;
}

export function calculatePrepayment(
  outstandingPrincipal: number,
  annualRatePercent: number,
  remainingTenureMonths: number,
  lumpSum: number,
  recurringExtra: number,
  strategy: "reduce-tenure" | "reduce-emi"
): PrepaymentResult {
  const baseCalc = calculateEmi(outstandingPrincipal, annualRatePercent, remainingTenureMonths);
  const originalEmi = baseCalc.monthlyEmi;
  const originalTotalInterest = baseCalc.totalInterest;

  if (outstandingPrincipal <= 0 || remainingTenureMonths <= 0) {
    return {
      originalEmi,
      originalTotalInterest,
      originalTenureMonths: remainingTenureMonths,
      newEmi: 0,
      newTotalInterest: 0,
      newTenureMonths: 0,
      interestSaved: 0,
      tenureSavedMonths: 0,
    };
  }

  const monthlyRate = annualRatePercent / 12 / 100;
  
  // If there's no extra payment at all, just return the base calculation
  if (lumpSum === 0 && recurringExtra === 0) {
    return {
      originalEmi,
      originalTotalInterest,
      originalTenureMonths: remainingTenureMonths,
      newEmi: originalEmi,
      newTotalInterest: originalTotalInterest,
      newTenureMonths: remainingTenureMonths,
      interestSaved: 0,
      tenureSavedMonths: 0,
    };
  }

  // If the user chooses to reduce EMI and has NO recurring extra payment, 
  // we can just use the standard EMI formula for exactness.
  if (strategy === "reduce-emi" && recurringExtra === 0) {
    const newPrincipal = Math.max(0, outstandingPrincipal - lumpSum);
    const newCalc = calculateEmi(newPrincipal, annualRatePercent, remainingTenureMonths);
    
    return {
      originalEmi,
      originalTotalInterest,
      originalTenureMonths: remainingTenureMonths,
      newEmi: newCalc.monthlyEmi,
      newTotalInterest: newCalc.totalInterest,
      newTenureMonths: remainingTenureMonths,
      interestSaved: Math.max(0, originalTotalInterest - newCalc.totalInterest),
      tenureSavedMonths: 0,
    };
  }

  // Otherwise, we simulate month-by-month
  let baseEmiForSimulation = originalEmi;
  if (strategy === "reduce-emi") {
    const newPrincipal = Math.max(0, outstandingPrincipal - lumpSum);
    const newCalc = calculateEmi(newPrincipal, annualRatePercent, remainingTenureMonths);
    baseEmiForSimulation = newCalc.monthlyEmi;
  }

  const payment = baseEmiForSimulation + recurringExtra;

  let balance = Math.max(0, outstandingPrincipal - lumpSum);
  let months = 0;
  let totalInterest = 0;

  if (balance > 0) {
    while (balance > 0.01 && months < 1200) {
      let interestForMonth = balance * monthlyRate;
      totalInterest += interestForMonth;
      
      let actualPayment = payment;
      if (actualPayment > balance + interestForMonth) {
        actualPayment = balance + interestForMonth;
      }
      
      balance -= (actualPayment - interestForMonth);
      months++;
    }
  }

  return {
    originalEmi,
    originalTotalInterest,
    originalTenureMonths: remainingTenureMonths,
    newEmi: baseEmiForSimulation, // the required EMI, excluding the voluntary recurring extra
    newTotalInterest: round2(totalInterest),
    newTenureMonths: months,
    interestSaved: Math.max(0, originalTotalInterest - round2(totalInterest)),
    tenureSavedMonths: Math.max(0, remainingTenureMonths - months),
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
