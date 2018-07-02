import { parseNumFrom } from "./formats"

const parseState = fmts => obj =>
  Object.keys(obj).reduce(
    (acc, x) => ({
      ...acc,
      [x]:
        typeof obj[x] === "object"
          ? parseState(fmts[x])(obj[x])
          : fmts[x]
            ? parseNumFrom(fmts[x])(obj[x])
            : obj[x]
    }),
    {}
  )

export default parseState
