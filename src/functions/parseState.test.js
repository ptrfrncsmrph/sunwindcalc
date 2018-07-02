import parseState from "./parseState"
import { NUMBER, PERCENT, DOLLAR, CENT } from "./formats"

const stateFormats = {
  firstYearProduction: NUMBER,
  annualDegradation: PERCENT,
  systemCapacity: NUMBER,
  systemCost: DOLLAR,
  massTaxCredit: x => x,
  federalTaxCredit: x => x,
  depreciation: {
    taxRate: PERCENT,
    bonusDepreciationRate: PERCENT
  },
  nantucketSolar: DOLLAR,
  sREC: {
    initialValue: CENT,
    annualChange: PERCENT
  },
  sMART: {
    initialValue: CENT,
    capYear: NUMBER
  },
  netMetering: {
    initialValue: CENT,
    annualChange: PERCENT
  },
  maintenance: {
    initialValue: DOLLAR,
    annualChange: PERCENT,
    interval: NUMBER,
    start: NUMBER
  },
  insurance: {
    initialValue: DOLLAR,
    annualChange: PERCENT
  },
  loan: {
    principal: DOLLAR,
    interest: PERCENT,
    years: NUMBER
  }
}

it("parseState parses all leaves of state tree", () => {
  const input = {
    hasSubmitted: false,
    firstYearProduction: "69,218",
    annualDegradation: "0.5",
    systemCapacity: "7920",
    systemCost: "25500",
    massTaxCredit: {
      isActive: true
    },
    federalTaxCredit: {
      isActive: true
    },
    depreciation: {
      isActive: true,
      taxRate: "35",
      bonusDepreciationRate: "40"
    },
    nantucketSolar: "0",
    sREC: {
      isActive: true,
      initialValue: "0.23",
      annualChange: "0"
    },
    sMART: {
      isActive: false,
      initialValue: "0.17",
      capYear: "10"
    },
    netMetering: {
      isActive: false,
      initialValue: "0.19",
      annualChange: "2"
    },
    maintenance: {
      isActive: false,
      initialValue: "300",
      annualChange: "2",
      interval: "4",
      start: "3"
    },
    insurance: {
      isActive: false,
      initialValue: "150",
      annualChange: "2"
    },
    loan: {
      isActive: false,
      principal: "26000",
      interest: "3.5",
      years: "10"
    }
  }

  const expected = {
    hasSubmitted: false,
    firstYearProduction: 69218,
    annualDegradation: 0.005,
    systemCapacity: 7920,
    systemCost: 25500,
    massTaxCredit: {
      isActive: true
    },
    federalTaxCredit: {
      isActive: true
    },
    depreciation: {
      isActive: true,
      taxRate: 0.35,
      bonusDepreciationRate: 0.4
    },
    nantucketSolar: 0,
    sREC: {
      isActive: true,
      initialValue: 0.23,
      annualChange: 0
    },
    sMART: {
      isActive: false,
      initialValue: 0.17,
      capYear: 10
    },
    netMetering: {
      isActive: false,
      initialValue: 0.19,
      annualChange: 0.02
    },
    maintenance: {
      isActive: false,
      initialValue: 300,
      annualChange: 0.02,
      interval: 4,
      start: 3
    },
    insurance: {
      isActive: false,
      initialValue: 150,
      annualChange: 0.02
    },
    loan: {
      isActive: false,
      principal: 26000,
      interest: 0.035,
      years: 10
    }
  }
  expect(parseState(stateFormats)(input)).toEqual(expected)
})
