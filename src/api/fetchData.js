import { Left, Right, either, bimap, show, tagBy, unchecked } from "sanctuary"
import { encaseP, tryP, of as future, mapRej } from "fluture"
import { chain, compose, map } from "ramda"
import { create, env } from "sanctuary-def"
import { env as flutureEnv } from "fluture-sanctuary-types"

import Result from "folktale/result"
import fetch from "node-fetch"

const def = create({ checkTypes: true, env: env.concat(flutureEnv) })
const { Ok, Error } = Result

// const fetch = url =>
//   Promise.resolve({
//     status: 200,
//     statusText: "OK",
//     ok: true,
//     value: { json: () => Promise.resolve("Whats this") }
//   })

const trace = x => {
  console.log(x)
  return x
}

const id = x => x
const isOk = ({ ok }) => !!ok

// parseJson :: Promise e r -> Future e r
const parseJson = ({ value: response }) =>
  tryP(() => {
    const { status, statusText } = response
    return response.json().then(data => ({ data, status, statusText }))
  })

// console.log(either(show)(show)(Left("poop")))

// export default compose(
//   mapRej(({ message, name }) => ({ message, name })),
//   // x => x.fork(console.log, console.log),
//   chain(
//     parseJson
//   ),
//   chain(
//     compose(
//       future,
//       fromPredicate(isOk)
//     )
//   ),
//   // traceMap(id)(id),
//   encaseP(fetch)
// )

compose(
  mapRej(({ message, name }) => ({ message, name })),
  chain(parseJson),
  chain(
    compose(
      future,
      unchecked.tagBy(isOk)
    )
  ),
  encaseP(fetch)
)("https://swapi.co/api/planets/331/?format=json").fork(
  x => console.log("Something went wrong"),
  console.log
)

// compose(
//   mapRej(({ message, name }) => ({ message, name })),
//   chain(x =>
//     x.matchWith({
//       Error: compose(
//         map(Error),
//         parseJson
//       ),
//       Ok: compose(
//         map(Ok),
//         parseJson
//       )
//     })
//   ),
//   chain(
//     compose(
//       future,
//       fromPredicateB(isOk)
//     )
//   ),
//   encaseP(fetch)
// )("https://swapi.co/api/planets/33889/?format=json").fork(console.log, console.log)
