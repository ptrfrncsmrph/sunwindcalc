import React, { Component, Fragment } from "react"
import uuidv1 from "uuid"
import styled from "styled-components"
import { last, lensPath, view } from "ramda"

import { camelToSentence } from "./functions/helper"
import mergeWithLatest from "./functions/mergeWithLatest"
import Button from "./components/Button"
import Form from "./components/Form"
import Container from "./components/Container"
import Subcontainer from "./components/Subcontainer"
import Grid from "./components/Grid"
import Heading from "./components/Heading"
import Input from "./components/Input"
import InputGroup from "./components/InputGroup"
import {
  DOLLAR,
  NUMBER,
  PITCH,
  PERCENT,
  CENT,
  formatAs,
  parseNumFrom
} from "./functions/formats"

import fetchData from "./api/fetchData"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

const trace = msg => x => {
  console.log(msg, x)
  return x
}

const latest = obj => obj[last(Object.keys(obj))]

const Table = styled.table`
  width: 100%;
  & tr {
    border: none;
  }
  & tr:nth-of-type(odd) {
    background-color: whitesmoke;
  }
  & th {
    text-align: left;
  }
  & td {
    text-align: right;
  }
`

const Data = styled.pre`
  font-family: "SF Mono";
  white-space: normal;
  padding: 0.5rem;
  background-color: whitesmoke;
  border-radius: 6px;
  overflow: hidden;
`

const Err = Data.extend`
  background-color: tomato;
`

const Result = styled.div``

const defaultAppState = {
  quantity: "20",
  capacity: "330",
  losses: "14%",
  tilt: "8:12",
  azimuth: "180",
  costPerWatt: "$3.15"
}

const arrayFormats = {
  quantity: NUMBER,
  capacity: NUMBER,
  losses: PERCENT,
  tilt: PITCH,
  azimuth: NUMBER,
  costPerWatt: CENT
}
const arrayDisplay = {
  quantity: "Quantity of panels",
  capacity: "Capacity of panels (Watts DC)",
  losses: "Percentage of losses (14% is typical with minimal shading)",
  tilt: "Tilt (in degrees or roof pitch)",
  azimuth: "Azimuth (degrees)",
  costPerWatt: "Target cost per Watt"
}

export default class Sizing extends Component {
  state = {
    arrays: {},
    usage: {}
  }

  componentDidMount() {
    this.addArray()
    this.addUsage()
  }

  addArray = () => {
    const key = uuidv1()
    const defaultLocalState =
      JSON.parse(localStorage.getItem("arrayState")) || {}

    this.setState(({ arrays }) => {
      this.updateGlobal({
        ...arrays,
        [key]: mergeWithLatest(defaultLocalState, defaultAppState)
      })
      return {
        arrays: {
          ...arrays,
          [key]: mergeWithLatest(defaultLocalState, defaultAppState)
        }
      }
    })
  }

  deleteArray = arr => {
    this.setState(({ arrays }) => {
      this.updateGlobal(
        Object.keys(arrays)
          .filter(key => key !== arr)
          .reduce(
            (acc, x) => ({
              ...acc,
              [x]: arrays[x]
            }),
            {}
          )
      )
      return {
        arrays: Object.keys(arrays)
          .filter(key => key !== arr)
          .reduce(
            (acc, x) => ({
              ...acc,
              [x]: arrays[x]
            }),
            {}
          )
      }
    })
  }

  updateArray = key => values => {
    this.setState(({ arrays }) => {
      this.updateGlobal({ ...arrays, [key]: { ...values } })
      return {
        arrays: { ...arrays, [key]: { ...values } }
      }
    })
    localStorage.setItem(
      "arrayState",
      JSON.stringify(this.state.arrays[last(Object.keys(this.state.arrays))])
    )
  }

  addUsage = () => {
    const key = uuidv1()
    const defaultLocalUsageState =
      JSON.parse(localStorage.getItem("usageState")) || {}

    const defaultAppUsageState = MONTHS.reduce(
      (acc, month) => ({ ...acc, [month]: "200" }),
      {}
    )
    console.log(defaultLocalUsageState)
    console.log(defaultAppUsageState)
    this.setState(({ usage }) => {
      this.updateGlobal({
        ...usage,
        [key]: mergeWithLatest(defaultLocalUsageState, defaultAppUsageState)
      })
      return {
        usage: {
          ...usage,
          [key]: mergeWithLatest(defaultLocalUsageState, defaultAppUsageState)
        }
      }
    })
  }

  updateUsage = key => values => {
    this.setState(({ usage }) => ({
      usage: { ...usage, [key]: { ...values } }
    }))
    localStorage.setItem(
      "usageState",
      JSON.stringify(this.state.usage[last(Object.keys(this.state.usage))])
    )
  }

  updateGlobal = arrays => {
    this.props.changeGlobal("firstYearProduction")(
      formatAs(NUMBER)(
        Object.keys(arrays)
          .map(key => arrays[key])
          .reduce(
            (acc, array) =>
              acc +
              (view(lensPath(["data", "outputs", "ac_annual"]), array) || 0),
            0
          )
      )
    )
    this.props.changeGlobal("systemCapacity")(
      formatAs(NUMBER)(
        Object.keys(arrays)
          .map(key => arrays[key])
          .reduce(
            (acc, { quantity = "0", capacity = "0" }) =>
              acc + quantity * capacity,
            0
          )
      )
    )
    this.props.changeGlobal("systemCost")(
      formatAs(DOLLAR)(
        Object.keys(arrays)
          .map(key => arrays[key])
          .reduce(
            (acc, { quantity = "0", capacity = "0", costPerWatt = "0" }) =>
              acc + quantity * capacity * parseNumFrom(CENT)(costPerWatt),
            0
          )
      )
    )
  }

  handleSubmit = () => {
    const { arrays } = this.state
    Object.keys(arrays).map(arr =>
      fetchData(arrays[arr]).fork(
        error =>
          this.setState(({ arrays }) => ({
            arrays: {
              ...arrays,
              [arr]: {
                ...arrays[arr],
                error
              }
            }
          })),
        ({ data }) =>
          this.setState(({ arrays }) => {
            this.updateGlobal({
              ...arrays,
              [arr]: {
                ...arrays[arr],
                data
              }
            })
            return {
              arrays: {
                ...arrays,
                [arr]: {
                  ...arrays[arr],
                  data
                }
              }
            }
          })
      )
    )
  }

  render() {
    const { arrays, usage } = this.state
    const totalUsage = Object.values(usage).reduce(
      (acc, acct) =>
        acc +
        Object.values(acct).reduce(
          (acc, x) => acc + parseNumFrom(NUMBER)(x),
          0
        ),
      0
    )

    return (
      <Grid cols={3}>
        <Container>
          <Subcontainer>
            <Form
              onSubmit={e => {
                e.preventDefault()
                this.handleSubmit()
              }}
            >
              {Object.keys(arrays).map((arr, i) => (
                <Fragment key={arr}>
                  <Heading>
                    <h4>Array {i + 1}</h4>
                  </Heading>
                  <InputGroup
                    values={arrays[arr]}
                    onValues={this.updateArray(arr)}
                    key={arr}
                  >
                    {Object.keys(arrays[arr])
                      .filter(key => key !== "data" && key !== "error")
                      .map(key => (
                        <Input
                          key={key}
                          name={key}
                          title={arrayDisplay[key]}
                          value={arrays[arr][key]}
                          fmt={arrayFormats[key]}
                        />
                      ))}
                  </InputGroup>
                  {arrays[arr].error && (
                    <Err>{JSON.stringify(arrays[arr].error, null, 2)}</Err>
                  )}
                  <Button
                    type="button"
                    onClick={e => {
                      e.preventDefault()
                      this.deleteArray(arr)
                    }}
                    value="Delete This Array"
                  />
                </Fragment>
              ))}
              <Button
                type="button"
                onClick={e => {
                  e.preventDefault()
                  this.addArray(e)
                }}
                value="Add New Array"
              />
              <Button
                type="submit"
                onClick={e => {
                  e.preventDefault()
                  this.handleSubmit()
                }}
                value="Submit to PVWatts"
              />
            </Form>
          </Subcontainer>
        </Container>
        <Container>
          <Subcontainer>
            <Heading>
              <h4>Usage data</h4>
            </Heading>
            <p>
              <em>(Optional)</em> Enter customer usage data in kWh.
            </p>
            <Form cols={2}>
              {Object.keys(usage).map(acct => (
                <InputGroup
                  values={usage[acct]}
                  onValues={this.updateUsage(acct)}
                  key={acct}
                >
                  {Object.keys(usage[acct])
                    .filter(key => key !== "data" && key !== "error")
                    .map(key => (
                      <Input
                        key={key}
                        name={key}
                        title={key}
                        value={usage[acct][key]}
                        fmt={NUMBER}
                      />
                    ))}
                </InputGroup>
              ))}
            </Form>
          </Subcontainer>
        </Container>
        <Container>
          <Subcontainer>
            <Heading>
              <h4>System overview</h4>
            </Heading>
            <p>
              This section will be updated when you edit the columns to the
              left. If <em>First year production</em> is 0, need to press{" "}
              <strong>Submit</strong> button to fetch results from PVWatts.
            </p>
            <Table>
              <tbody>
                {Object.keys(this.props.global)
                  .filter(key => key !== "annualDegradation")
                  .map(key => (
                    <tr key={key}>
                      <th scope="row">{camelToSentence(key)}</th>
                      <td>{this.props.global[key]}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <Heading>
              <h4>Usage offset</h4>
            </Heading>
            <Table>
              <tbody>
                <tr>
                  <th scope="row">Total usage</th>
                  <td>{formatAs(NUMBER)(totalUsage)}</td>
                </tr>
                <tr>
                  <th scope="row">Percent offset</th>
                  <td>
                    {formatAs(PERCENT)(
                      (parseNumFrom(NUMBER)(
                        this.props.global.firstYearProduction
                      ) /
                        totalUsage) *
                        100
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Subcontainer>
        </Container>
      </Grid>
    )
  }
}
