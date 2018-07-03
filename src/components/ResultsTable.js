import React, { Fragment } from "react"
import { head, compose, reduce } from "ramda"
import styled from "styled-components"

import parseState from "../functions/parseState"
import { incentiveCalculations } from "../functions/calculations"
import {
  parseNumFrom,
  formatAs,
  DOLLAR,
  NUMBER,
  CENT
} from "../functions/formats"
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
    font-family: var(--mono-font);
    font-size: 0.8rem;
  }
  & th {
    font-family: var(--sans-font);
    font-size: 0.8rem;
    text-align: center;
  }
  & th[scope="row"] {
    text-align: right;
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
    <Fragment>
      <Table>
        <tbody>
          {keys.map(
            key =>
              key === "federalTaxCredit" ? (
                <tr>
                  <th scope="row">Federal tax credit</th>
                  <td>
                    {parameters.systemCost} * 30% ={" "}
                    {formatAs(DOLLAR)(head(res)[key])}
                  </td>
                </tr>
              ) : key === "massTaxCredit" ? (
                <tr>
                  <th scope="row">State tax credit</th>
                  <td>{formatAs(DOLLAR)(head(res)[key])}</td>
                </tr>
              ) : key === "sREC" ? (
                <tr>
                  <th scope="row">SREC (first year)</th>
                  <td>
                    {parameters.firstYearProduction} kWh *{" "}
                    {parameters.sREC.marketSector} *{" "}
                    {parameters.sREC.initialValue} ={" "}
                    {formatAs(DOLLAR)(head(res)[key])}
                  </td>
                </tr>
              ) : key === "sMART" ? (
                <tr>
                  <th scope="row">SMART (first year)</th>
                  <td>
                    {parameters.firstYearProduction} kWh * ({
                      parameters.sMART.initialValue
                    }{" "}
                    - {parameters.netMetering.initialValue}) ={" "}
                    {formatAs(DOLLAR)(head(res)[key])}
                  </td>
                </tr>
              ) : key === "netMetering" ? (
                <tr>
                  <th scope="row">Net metering (first year)</th>
                  <td>
                    {parameters.firstYearProduction} kWh *{" "}
                    {parameters.netMetering.initialValue} ={" "}
                    {formatAs(DOLLAR)(head(res)[key])}
                  </td>
                </tr>
              ) : null
          )}
          <tr>
            <th scope="row">System cost less tax credits</th>
            <td>
              {formatAs(DOLLAR)(
                parseNumFrom(DOLLAR)(parameters.systemCost) -
                  head(res).federalTaxCredit -
                  head(res).massTaxCredit
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost per Watt (before tax credits)</th>
            <td>
              {formatAs(CENT)(
                parseNumFrom(DOLLAR)(parameters.systemCost) /
                  parseNumFrom(NUMBER)(parameters.systemCapacity)
              )}
            </td>
          </tr>
        </tbody>
      </Table>
      <h4>Simple ROI</h4>
      <Table>
        <tbody>
          <tr>
            <th scope="row">Total revenue first year</th>
            <td>
              {formatAs(DOLLAR)(
                (keys.includes("sREC") ? head(res).sREC : 0) +
                  (keys.includes("sMART") ? head(res).sMART : 0) +
                  (keys.includes("netMetering") ? head(res).netMetering : 0)
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">
              Simple ROI (system cost less incentives / first year revenue)
            </th>
            <td>
              {(
                (parseNumFrom(DOLLAR)(parameters.systemCost) -
                  head(res).federalTaxCredit -
                  head(res).massTaxCredit) /
                ((keys.includes("sREC") ? head(res).sREC : 0) +
                  (keys.includes("sMART") ? head(res).sMART : 0) +
                  (keys.includes("netMetering") ? head(res).netMetering : 0))
              ).toFixed(2)}{" "}
              year(s)
            </td>
          </tr>
        </tbody>
      </Table>
      <h4>Lifetime Revenue</h4>
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
    </Fragment>
  )
}
