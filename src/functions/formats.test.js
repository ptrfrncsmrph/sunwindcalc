import { formatAs, parseFrom } from "./formats"
import React from "react"
import renderer from "react-test-renderer"
import { compose } from "ramda"

const arr = ["3,000", "300", "2,000,000", "0"]
const arr2 = ["30.00", "3.00", "2,000.23", "2,000.10", "0.00"]
const arr3 = ["$30.00", "$3.00", "$2,000.23", "$2,000.10"]
const arr4 = ["0.3%", "0.45%", "23%", "40%"]

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
  expect(testArr("NUMBER")(arr)).toBe(true)
})
it("Number format should be (quasi-)isomorphic", () => {
  expect(testArr("NUMBER")(arr)).toBe(true)
})
it("Dollar format should be (quasi-)isomorphic", () => {
  expect(testArr("DOLLAR")(arr3)).toBe(true)
})
it("Percent format should be (quasi-)isomorphic", () => {
  arr4.map(e => expect(isoPF("PERCENT")(e)).toBe(e))
})
