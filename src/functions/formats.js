// leftPad :: Show a => Char -> Int -> a -> String
const leftPad = c => n => x =>
  x.toString().length < n
    ? (c.repeat(n) + x.toString()).slice(-n)
    : x.toString()

// format :: Show a => Format -> a -> String
export const formatAs = fmt => x => {
  switch (fmt) {
    case "DOLLAR":
      return `$${leftPad("0")(3)(x)
        .replace(/([0-9]{2})$/, ".$1")
        .replace(/\B(?=(\d{3})+(?=\.))/g, ",")}`
    case "PERCENT":
      return `${Math.round(x * 1000) / 10}%`
    case "NUMBER":
      return (+x).toLocaleString("en-us")
    default:
      return ""
  }
}

// parse :: Format -> String -> String
export const parseAs = fmt => str => {
  switch (fmt) {
    case "CENT":
      return str.replace(/[^0-9]/g, "").replace(/^0*(\d+)/, "$1")
    case "NUMBER":
      return str.replace(/[^0-9]/g, "").replace(/^0*(\d+)/, "$1")
    default:
      return undefined
  }
}
