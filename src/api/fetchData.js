import { unchecked } from "sanctuary"
import { encaseP, tryP, of as future, mapRej } from "fluture"
import { chain, compose } from "ramda"
import fetch from "node-fetch"

import fromParamsToURL from "./fromParamsToURL"
import fromStateToParams from "./fromStateToParams"

const isOk = ({ ok }) => !!ok

// parseJson :: Promise e r -> Future e r
const parseJson = ({ value: response }) =>
  tryP(() => {
    const { status, statusText } = response
    return response.json().then(data => ({ data, status, statusText }))
  })

// fetchData :: URL -> Future e r
export default compose(
  mapRej(({ message, name }) => ({ message, name })),
  chain(parseJson),
  chain(
    compose(
      future,
      unchecked.tagBy(isOk)
    )
  ),
  encaseP(fetch),
  fromParamsToURL,
  fromStateToParams
)
