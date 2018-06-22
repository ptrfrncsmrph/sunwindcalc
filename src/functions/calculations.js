import { curry, compose, multiply } from "ramda"

export const valueAt = curry(
  (time, change, initialValue) => (1 + change) ** time * initialValue
)

const range = x =>
  Array(x)
    .fill("")
    .map((_, i) => i)

// TODO: Convert all values to Maybe's instead of using this:
// nullCheck :: !Number -> Number (??)
export const nullCheck = x =>
  isNaN(x) || x === undefined || x === null ? 0 : x

export const capAt = curry((time, capWhen, x) => (time < capWhen ? x : 0))
const startAt = curry((time, start, x) => (time >= start ? x : 0))
const evalAt = curry(
  (time, interval, start, x) => ((time + start) % interval === 0 ? x : 0)
)

export const toNearest = curry((number, x) => Math.round(x / number) * number)
const negate = x => -x

/*
*** This is probs bad type annotation ***
incentiveCalculations :: (years: Int) -> ({
  firstYearProduction: Int (kWh),
  annualDegradation: Float (Unit Interval),
  systemCapacity: Int (Watts),
  sREC: {
    initialValue: Int (Dollars),
    annualChange: Float (+/- Unit Interval)
  },
  sMART: {
    initialValue: Int (Dollars),
    capYear: Int (Years)
  },
  netMetering: {
    initialValue: Int (Dollars),
    annualChange: Float (+/- Unit Interval)
  },
  depreciation: {
    taxRate: Float (Unit Interval),
    bonusDepreciationRate: Float (Unit Interval)
  },
  systemCost: Int (Dollars),
  nantucketSolar: Int (Dollars),
  maintenance: {
    initialValue: Int (Dollars),
    annualChange: Float (+/- Unit Interval),
    interval: Int (Years),
    start: Int (Years)
  },
  insurance: {
    initialValue: Int (Dollars),
    annualChange: Float (+/- Unit Interval)
  }
}) -> ([
  {
    netMetering: Int (Dollars),
    sMART: Int (Dollars),
    sREC: Int (Dollars),
    depreciation: Int (Dollars),
    massTaxCredit: Int (Dollars),
    federalTaxCredit: Int (Dollars),
    nantucketSolar: Int (Dollars),
    maintenance: -Int (Dollars),
    insurance: -Int (Dollars)
  },
...
])
*/
export const incentiveCalculations = years => ({
  firstYearProduction,
  annualDegradation,
  systemCapacity,
  sREC,
  sMART,
  netMetering,
  systemCost,
  depreciation,
  nantucketSolar,
  maintenance,
  insurance,
  loan
}) =>
  range(years).map(year => ({
    netMetering: (({ initialValue, annualChange }) =>
      compose(
        nullCheck,
        multiply(valueAt(year)(annualDegradation)(firstYearProduction)),
        valueAt(year)(annualChange)
      )(initialValue))(netMetering),
    sMART: (({ initialValue, capYear }) =>
      compose(
        capAt(year)(capYear),
        nullCheck,
        multiply(valueAt(year)(annualDegradation)(firstYearProduction))
      )(initialValue))(sMART),
    sREC: (({ initialValue, annualChange }) =>
      compose(
        capAt(year)(10),
        nullCheck,
        multiply(valueAt(year)(annualDegradation)(firstYearProduction)),
        valueAt(year)(annualChange)
      )(initialValue))(sREC),
    depreciation: (({ bonusDepreciationRate, taxRate }) =>
      compose(
        capAt(year)(6),
        nullCheck,
        multiply(taxRate),
        x => (year === 0 ? x + bonusDepreciationRate * systemCost : x),
        // The following table is from MACRS 5-year depreciation schedule
        // https://www.irs.gov/pub/irs-pdf/p946.pdf (see Table A-1)
        multiply([0.2, 0.32, 0.192, 0.1152, 0.1152, 0.0576][year]),
        multiply(1 - bonusDepreciationRate),
        multiply(0.85)
      )(systemCost))(depreciation),
    massTaxCredit: compose(
      nullCheck,
      capAt(year)(1),
      curry(Math.min)(1000),
      multiply(0.15)
    )(systemCost),
    federalTaxCredit: compose(
      capAt(year)(1),
      nullCheck,
      multiply(0.3)
    )(systemCost),
    nantucketSolar: compose(
      capAt(year)(1),
      nullCheck
    )(nantucketSolar),
    maintenance: (({ initialValue, annualChange, interval, start }) =>
      compose(
        nullCheck,
        negate,
        toNearest(10),
        startAt(year)(start),
        evalAt(year)(interval)(start),
        valueAt(year)(annualChange)
      )(initialValue))(maintenance),
    insurance: (({ initialValue, annualChange }) =>
      compose(
        nullCheck,
        negate,
        toNearest(10),
        valueAt(year)(annualChange)
      )(initialValue))(insurance),
    loan: (({ years, interest, principal }) =>
      compose(
        nullCheck,
        capAt(year)(years),
        negate,
        multiply(12)
      )(
        (principal * (1 + interest / 12) ** (years * 12) * (interest / 12)) /
          ((1 + interest / 12) ** (years * 12) - 1)
      ))(loan)
  }))
