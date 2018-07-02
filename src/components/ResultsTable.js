import React from "react"
import { head, compose, reduce, scan } from "ramda"
import styled from "styled-components"

import parseState from "../functions/parseState"
import { incentiveCalculations } from "../functions/calculations"
import { formatAs, DOLLAR } from "../functions/formats"
import { camelToSentence } from "../functions/helper"

const Table = styled.table`
  min-width: 0;
  & tr:nth-of-type(odd) {
    background-color: whitesmoke;
  }

  & td,
  th {
    padding: 5px;
  }
  & td {
    text-align: right;
  }
  & thead {
    border-bottom: 1px dotted black;
  }
  & * {
    font-family: "SF Mono";
    font-size: 0.8rem;
  }
  & th {
    font-family: "Circular Std";
    font-size: 0.8rem;
    text-align: center;
  }
`

export default ({ fmts, parameters }) => {
  const res = compose(
    incentiveCalculations(25),
    parseState(fmts)
  )(parameters)
  const keys = Object.keys(head(res)).filter(
    key => (parameters[key] ? parameters[key].isActive : head(res)[key] > 0)
  )
  return (
    <Table>
      <thead>
        <tr>
          <th scope="colum">Year</th>
          {keys.map(key => <th scope="column">{camelToSentence(key)}</th>)}
          <th scope="column">Total</th>
        </tr>
      </thead>
      <tbody>
        {res.map((row, i) => (
          <tr>
            <th scope="row">{i + 2018}</th>
            {keys.map(key => (
              <td>{row[key] ? formatAs(DOLLAR)(row[key]) : ""}</td>
            ))}
            <td>
              {formatAs(DOLLAR)(keys.reduce((acc, key) => acc + row[key], 0))}
            </td>
          </tr>
        ))}
        <tr>
          <th scope="row">Total</th>
          <td colspan={keys.length + 1}>
            {compose(
              formatAs(DOLLAR),
              reduce(
                (acc, row) =>
                  acc + keys.reduce((acc, key) => acc + row[key], 0),
                0
              )
            )(res)}
          </td>
        </tr>
      </tbody>
    </Table>
  )
}
