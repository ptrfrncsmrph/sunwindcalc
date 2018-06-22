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
    initialValue: 400,
    annualChange: 0.02,
    interval: 4,
    start: 3
  },
  insurance: {
    initialValue: 0,
    annualChange: 0.02
  },
  loan: {
    principal: 0,
    interest: 0.035,
    years: 10
  }
})

res
