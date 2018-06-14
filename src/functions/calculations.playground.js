import { incentiveCalculations } from "./calculations"

const res = incentiveCalculations(25)({
  firstYearProduction: 9498,
  annualDegradation: 0.005,
  systemCapacity: 7920,
  sREC: {
    initialValue: 0,
    annualChange: 0
  },
  sMART: {
    initialValue: 0.17,
    capYear: 10
  },
  netMetering: {
    initialValue: 0.19,
    annualChange: 0.02
  },
  systemCost: 25500,
  taxRate: 0.35,
  bonusDepreciationRate: 0.4,
  nantucketSolar: 0,
  maintenance: {
    initialValue: 300,
    annualChange: 0.02,
    interval: 4,
    start: 3
  },
  insurance: {
    initialValue: 150,
    annualChange: 0.02
  },
  loan: {
    principal: 26000,
    interest: 0.035,
    years: 10
  }
})

console.log(res)
