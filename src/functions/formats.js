// leftPad :: Show a => Char -> Int -> a -> String
const leftPad = c => n => x =>
  x.toString().length < n
    ? (c.repeat(n) + x.toString()).slice(-n)
    : x.toString()

// format :: Show a => Format -> a -> String
export const formatAs = fmt => x => {
  switch (fmt) {
    case "DOLLAR":
      // return x
      return `$${leftPad("0")(3)(x)
        .replace(/([0-9]{2})$/, ".$1")
        .replace(/\B(?=(\d{3})+(?=\.))/g, ",")}`
    case "PERCENT":
      // return x
      return `${(+x).toLocaleString("en-US")}%`
    case "NUMBER":
      // return x
      return (+x).toLocaleString("en-US")
    default:
      return ""
  }
}

const removeNonDigit = str =>
  str.replace(/[^0-9|\.]/g, "").replace(/^0*(\d+.*)/, "$1")

// parse :: Format -> String -> String
export const parseFrom = fmt => str => {
  switch (fmt) {
    case "DOLLAR":
      // return str
      return str.replace(/[^0-9]/g, "").replace(/^0*(\d+)/, "$1")
    case "PERCENT":
      // return str
      return `${+removeNonDigit(str)}`
    case "NUMBER":
      // return str
      return str.replace(/[^0-9]/g, "").replace(/^0*(\d+)/, "$1")
    default:
      return ""
  }
}

console.log()
