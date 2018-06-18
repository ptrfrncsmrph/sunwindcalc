export const DOLLAR = "DOLLAR"
export const NUMBER = "NUMBER"
export const PERCENT = "PERCENT"
export const CENT = "CENT"

// leftPad :: Show a => Char -> Int -> a -> String
const leftPad = c => n => x =>
  x.toString().length < n
    ? (c.repeat(n) + x.toString()).slice(-n)
    : x.toString()

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
    default:
      return ""
  }
}
