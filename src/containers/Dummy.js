import React from "react"
import { head } from "ramda"
import styled from "styled-components"
import { res2 as res } from "../functions/calculations.playground.js"
import { incentiveCalculations } from "../functions/calculations"

const Table = styled.table`
  & td,
  th {
    border: 5px solid transparent;
  }
  & * {
    font-family: "SF Mono";
    font-size: 0.8rem;
  }
`

export default ({ parameters }) => {
  const res = parameters
  const keys = Object.keys(head(res)).filter(_ => true)
  console.log(res)
  return (
    <Table>
      <thead>
        <tr>{keys.map(key => <th>{key}</th>)}</tr>
      </thead>
      <tbody>
        {res.map(row => <tr>{keys.map(key => <td>{row[key]}</td>)}</tr>)}
      </tbody>
    </Table>
  )
}
