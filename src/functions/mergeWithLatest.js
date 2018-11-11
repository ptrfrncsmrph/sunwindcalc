import { mergeDeepRight } from "ramda"

const mergeWithLatest = (fromLocal, fromApp) =>
  fromLocal
    ? Object.keys(fromApp).reduce(
        (acc, key) => ({
          ...acc,
          [key]:
            typeof fromApp[key] === "object"
              ? mergeWithLatest(fromLocal[key], fromApp[key])
              : fromLocal[key] || fromApp[key]
        }),
        {}
      )
    : fromApp

export default mergeWithLatest
