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
      return `${(+x)
        .toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        })
        .slice(0, -3)}`
    case CENT:
      return `${(+x).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      })}`
    case PERCENT:
      return `${(+x).toLocaleString("en-US")}%`
    case NUMBER:
      return `${Math.round(+x).toLocaleString("en-US")}`
    case PITCH:
      return x
    default:
      return ""
  }
}

const removeNonDigit = str =>
  str.replace(/[^0-9|\.|\-]/g, "").replace(/^0*(\d+.*)/, "$1")

const radiansToDegrees = radians => (radians * 180) / Math.PI

const toFixed = n => x => x.toFixed(n)

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
            toFixed(1),
            radiansToDegrees,
            ([rise, run]) => Math.atan(rise / run),
            map(parseInt),
            map(removeNonDigit),
            split(/[:/]/)
          )(str)}`
        : `${+removeNonDigit(str)}`
    default:
      return ""
  }
}

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
            toFixed(1),
            radiansToDegrees,
            ([rise, run]) => Math.atan(rise / run),
            map(parseInt),
            map(removeNonDigit),
            split(/[:/]/)
          )(str)
        : +removeNonDigit(str)
    default:
      return null
  }
}
