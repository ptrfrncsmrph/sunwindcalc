import {
  formatAs,
  parseFrom,
  parseNumFrom,
  CENT,
  NUMBER,
  DOLLAR,
  PERCENT,
  PITCH
} from "./formats"
import { compose } from "ramda"

const NUMBERS = ["3,000", "300", "2,000,000", "0"]
const CENTS = ["$30.00", "$3.00", "$2,000.23", "$2,000.10"]
const DOLLARS = ["$30", "$3", "$2,000", "$2,000"]
const PERCENTS = ["0.3%", "0.45%", "23%", "40%"]

const NUMBERSEXP = [3000, 300, 2000000, 0]
const CENTSEXP = [30, 3, 2000.23, 2000.1]
const DOLLARSEXP = [30, 3, 2000, 2000]
const PERCENTSEXP = [0.003, 0.0045, 0.23, 0.4]

const isoPF = fmt =>
  compose(
    formatAs(fmt),
    parseFrom(fmt)
  )

const testArr = fmt => arr =>
  arr
    .map(
      compose(
        formatAs(fmt),
        parseFrom(fmt)
      )
    )
    .map((x, i) => x === arr[i])
    .every(x => x)

it("Number format should be (quasi-)isomorphic", () => {
  expect(testArr(NUMBER)(NUMBERS)).toBe(true)
})
it("Percent format should be (quasi-)isomorphic", () => {
  PERCENTS.map(e => expect(isoPF(PERCENT)(e)).toBe(e))
})

it("parseNumFrom should work for dollars", () => {
  DOLLARSEXP.map((e, i) => expect(parseNumFrom(DOLLAR)(DOLLARS[i])).toBe(e))
})
it("parseNumFrom should work for cents", () => {
  CENTSEXP.map((e, i) => expect(parseNumFrom(CENT)(CENTS[i])).toBe(e))
})
it("parseNumFrom should work for numbers", () => {
  NUMBERSEXP.map((e, i) => expect(parseNumFrom(NUMBER)(NUMBERS[i])).toBe(e))
})
it("parseNumFrom should work for percents", () => {
  PERCENTSEXP.map((e, i) =>
    expect(parseNumFrom(PERCENT)(PERCENTS[i])).toBeCloseTo(e)
  )
})

it("parseNumFrom should work for pitches", () => {
  const input = ["22", "10.5", "5:12", "9/12", "12/12"]
  const expected = [22, 10.5, 22.6, 36.9, 45]
  input.map((e, i) => expect(parseNumFrom(PITCH)(e)).toBeCloseTo(expected[i]))
})
