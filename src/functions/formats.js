import { map, compose, split } from "ramda"

export const DOLLAR = "DOLLAR"
export const NUMBER = "NUMBER"
export const PERCENT = "PERCENT"
export const CENT = "CENT"
export const PITCH = "PITCH"

// format :: Show a => Format -> a -> String
export const formatAs = fmt => x => {
  switch (fmt) {
    case DOLLAR:
      return `${
        (+x)
          .toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
          })
          .split(".")[0]
      }`
    case CENT:
      return `${(+x).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      })}`
    case PERCENT:
      return `${(+x).toLocaleString("en-US")}%`
    case NUMBER:
      return `${(+x).toLocaleString("en-US")}`
    case PITCH:
      return x
    default:
      return ""
  }
}

const removeNonDigit = str =>
  str.replace(/[^0-9|\.|\-]/g, "").replace(/^0*(\d+.*)/, "$1")

// parse :: Format -> String -> String
export const parseFrom = fmt => str => {
  switch (fmt) {
    case DOLLAR:
      return `${+removeNonDigit(str)}`
    case CENT:
      return `${+removeNonDigit(str)}`
    case PERCENT:
      return `${+removeNonDigit(str)}`
    case NUMBER:
      return str.replace(/[^0-9]/g, "").replace(/^0*(\d+)/, "$1")
    case PITCH:
      return /[:/]/.test(str)
        ? `${compose(
            roundToTenth,
            toDegrees,
            x => Math.atan(x[0] / x[1]),
            map(parseInt),
            map(removeNonDigit),
            split(/[:/]/)
          )(str)}`
        : `${+removeNonDigit(str)}`
    default:
      return ""
  }
}

const toDegrees = radians => (radians * 180) / Math.PI
const roundToTenth = x => Math.round(x * 10) / 10

// parseNumFrom :: Format -> String -> Number
export const parseNumFrom = fmt => str => {
  switch (fmt) {
    case DOLLAR:
      return +removeNonDigit(str)
    case CENT:
      return +removeNonDigit(str)
    case PERCENT:
      return +removeNonDigit(str) / 100
    case NUMBER:
      return +removeNonDigit(str)
    case PITCH:
      return /[:/]/.test(str)
        ? compose(
            roundToTenth,
            toDegrees,
            x => Math.atan(x[0] / x[1]),
            map(parseInt),
            map(removeNonDigit),
            split(/[:/]/)
          )(str)
        : +removeNonDigit(str)
    default:
      return null
  }
}
