import React from "react"
import { head } from "ramda"
import styled from "styled-components"
import { res } from "../functions/calculations.playground.js"

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

export default props => {
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
