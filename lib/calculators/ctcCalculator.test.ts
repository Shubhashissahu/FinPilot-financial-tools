import { describe, it, expect } from "vitest";
import { calculateCtc, CtcInputs } from "./ctcCalculator";

describe("calculateCtc", () => {
  const defaultInputs: CtcInputs = {
    annualCtc: 1200000, // 12 LPA
    hraPercent: 40,
    daPercent: 0,
    ltaPercent: 0,
    specialAllowancePercent: 20,
    performanceBonusPercent: 0,
    epfApplicable: true,
    pfWageCapped: true,
    employeeEpfPercent: 12,
    employerEpfPercent: 12,
    professionalTaxApplicable: true,
  };

  it("calculates basic and allowances correctly based on percentages", () => {
    const result = calculateCtc(defaultInputs);
    // 40% + 20% = 60%, so basic should be 40%
    expect(result.basic).toBe(480000); // 40% of 12,000,000
    expect(result.hra).toBe(480000);   // 40%
    expect(result.specialAllowance).toBe(240000); // 20%
    expect(result.grossSalary).toBe(1200000); // basic + hra + special allowance
  });

  it("caps components if they exceed 100%", () => {
    const inputs = {
      ...defaultInputs,
      hraPercent: 80,
      specialAllowancePercent: 40,
    }; // total 120%
    const result = calculateCtc(inputs);
    expect(result.componentsCapped).toBe(true);
    expect(result.basic).toBe(0); // 100% used up
    expect(result.grossSalary).toBe(1200000); // Should still equal the entered annual CTC
  });

  it("calculates EPF correctly with wage capping", () => {
    // 12 LPA -> Basic is 4.8 LPA -> 40k/month
    // pfWageCapped = true, so EPF should be on max 15k/month -> 1.8 LPA wage base
    const result = calculateCtc(defaultInputs);
    expect(result.pfWageBase).toBe(180000); // 15000 * 12
    expect(result.employeeEpf).toBe(21600); // 12% of 180000
    expect(result.employerEpf).toBe(21600); // 12% of 180000
  });

  it("calculates EPF correctly without wage capping", () => {
    const inputs = {
      ...defaultInputs,
      pfWageCapped: false,
    };
    const result = calculateCtc(inputs);
    // Basic is 4.8 LPA
    expect(result.pfWageBase).toBe(480000); 
    expect(result.employeeEpf).toBe(57600); // 12% of 480000
    expect(result.employerEpf).toBe(57600); // 12% of 480000
  });

  it("handles zero CTC correctly", () => {
    const inputs = {
      ...defaultInputs,
      annualCtc: 0,
    };
    const result = calculateCtc(inputs);
    expect(result.grossSalary).toBe(0);
    expect(result.netAnnualSalary).toBe(0);
    expect(result.employeeEpf).toBe(0);
  });

  it("applies ESI correctly for salaries below ceiling", () => {
    const inputs = {
      ...defaultInputs,
      annualCtc: 240000, // 20k/month, below 21k ESI ceiling
    };
    const result = calculateCtc(inputs);
    expect(result.esiApplicable).toBe(true);
    expect(result.employeeEsi).toBe(1800); // 0.75% of 240000
    expect(result.employerEsi).toBe(7800); // 3.25% of 240000
  });

  it("does not apply ESI for salaries above ceiling", () => {
    const inputs = {
      ...defaultInputs,
      annualCtc: 300000, // 25k/month, above 21k ESI ceiling
    };
    const result = calculateCtc(inputs);
    expect(result.esiApplicable).toBe(false);
    expect(result.employeeEsi).toBe(0);
    expect(result.employerEsi).toBe(0);
  });
});
