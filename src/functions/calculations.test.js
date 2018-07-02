import { compose, curry, map, negate } from "ramda"
import { range, nullCheck, toNearest, valueAt } from "./calculations"

// export const startAt = curry((time, start, x) => (time >= start - 1 ? x : 0))
// export const evalAt = curry(
//   (time, interval, start, x) => ((time + start - 1) % interval === 0 ? x : 0)
// )

const startAt = year => start => val => (year >= start - 1 ? val : 0)

it("startAt works as expected", () => {
  expect(startAt(0)(1)(100)).toBe(100)
})

const evalAt = year => interval => start => val =>
  (year - start + 1) % interval === 0 ? val : 0

it("evalAt works as expected", () => {
  expect(evalAt(0)(1)(1)(100)).toBe(100)
  expect(evalAt(5)(2)(6)(100)).toBe(100)
})

const startEvalAt = start => interval => year => val =>
  year < start - 1 ? 0 : (year - (start - 1)) % interval === 0 ? val : 0

it("startEvalAt works as expected", () => {
  const inputs = {
    initialValue: 10,
    interval: 4,
    start: 2
  }
  const expected = [0, 10, 0, 0, 0, 10, 0, 0, 0, 10]

  const { initialValue, interval, start } = inputs

  expect(
    range(10).map(year => startEvalAt(start)(interval)(year)(initialValue))
  ).toEqual(expected)
})

const calcMaintenance = years => ({
  initialValue,
  annualChange,
  interval,
  start
}) =>
  range(years).map(year =>
    compose(
      nullCheck,
      x => (x > 0 ? negate(x) : x),
      toNearest(10),
      startAt(year)(start),
      evalAt(year)(interval)(start),
      valueAt(year)(annualChange)
    )(initialValue)
  )

it("Maintenance payments are calculated correctly", () => {
  const inputA = {
    initialValue: 10,
    annualChange: 0,
    interval: 5,
    start: 2
  }
  const inputB = {
    initialValue: 10,
    annualChange: 0,
    interval: 3,
    start: 3
  }
  const inputC = {
    initialValue: 10,
    annualChange: 1,
    interval: 1,
    start: 8
  }
  const expectA = [0, -10, 0, 0, 0, 0, -10, 0, 0, 0]
  const expectB = [0, 0, -10, 0, 0, -10, 0, 0, -10, 0]
  const expectC = [0, 0, 0, 0, 0, 0, 0, -10, -20, -40]

  // expect(calcMaintenance(10)(inputA)).toEqual(expectA)
  expect(calcMaintenance(10)(inputB)).toEqual(expectB)
  expect(calcMaintenance(10)(inputC)).toEqual(expectC)
})
