import { incentiveCalculations } from "./calculations"
import { reduce, scan } from "ramda"

// System 1 Nantucket, 55.04kW
export const res = incentiveCalculations(25)({
  firstYearProduction: 69218,
  annualDegradation: 0.004,
  systemCapacity: 55040,
  sREC: {
    initialValue: 0,
    annualChange: 0
  },
  sMART: {
    initialValue: 0.275,
    capYear: 20
  },
  netMetering: {
    initialValue: 0.2,
    annualChange: 0.02
  },
  systemCost: 180000,
  depreciation: {
    taxRate: 0.35,
    bonusDepreciationRate: 0.4
  },
  nantucketSolar: 0,
  maintenance: {
    initialValue: 500,
    annualChange: 0.02,
    interval: 4,
    start: 3
  },
  insurance: {
    initialValue: 150,
    annualChange: 0.02
  },
  loan: {
    principal: 0,
    interest: 0.035,
    years: 10
  }
})

// System 2 Nantucket (Annex), 16.32kW
export const res2 = incentiveCalculations(25)({
  firstYearProduction: 20173,
  annualDegradation: 0.004,
  systemCapacity: 16320,
  sREC: {
    initialValue: 0,
    annualChange: 0
  },
  sMART: {
    initialValue: 0.36,
    capYear: 10
  },
  netMetering: {
    initialValue: 0.2,
    annualChange: 0.02
  },
  systemCost: 56000,
  depreciation: {
    taxRate: 0.35,
    bonusDepreciationRate: 0.4
  },
  nantucketSolar: 0,
  maintenance: {
    initialValue: 300,
    annualChange: 0.02,
    interval: 4,
    start: 3
  },
  insurance: {
    initialValue: 75,
    annualChange: 0.02
  },
  loan: {
    principal: 0,
    interest: 0.035,
    years: 10
  }
})

res

res2
