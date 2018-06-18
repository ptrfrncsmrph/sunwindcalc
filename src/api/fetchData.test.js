import fetchData from "./fetchData"
import { either, id, Left, Right, show } from "sanctuary"

const fakeFetch = url =>
  Promise.resolve({
    status: 200,
    statusText: "OK",
    ok: true,
    json: () => Promise.resolve("Whats this")
  })

// it("Data fetches OK", () => {
//   expect(
//     either(show)(show)(
//       fetchData(fakeFetch)("dhhd").fork(traceMap(Left), traceMap(id))
//     )
//   ).toBe("0")
// })

// console.log(
//   // either(show)(show)(Left("poop")))
//   fetchData("dhhd").fork(Left, Right)
// )
