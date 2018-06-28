import React, { Component, Fragment } from "react"
import uuidv1 from "uuid"
import styled from "styled-components"
import { last, lensPath, view } from "ramda"

import mergeWithLatest from "./functions/mergeWithLatest"
import Button from "./components/Button"
import Form from "./components/Form"
import Container from "./components/Container"
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

const trace = msg => x => {
  console.log(msg, x)
  return x
}

const latest = obj => obj[last(Object.keys(obj))]

const Grid = styled.main`
  position: absolute;
  top: 0;
  display: grid;
  height: 100vh;
  width: 100%;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, 1fr)`};
  & > * {
    overflow: scroll;
    width: 100%;
    height: auto;
    max-height: 100%;
  }
  padding-left: 5rem;
  padding-right: 5rem;
  padding-top: 4rem;
  grid-gap: 1rem;
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
    arrays: {}
  }

  componentDidMount() {
    this.addArray()
  }

  addArray = () => {
    const key = uuidv1()
    const defaultLocalState = latest(JSON.parse(localStorage.getItem("state")))
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
              x: arrays[x]
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
              x: arrays[x]
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
      "state",
      JSON.stringify(this.state[last(Object.keys(this.state))])
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
          .reduce((acc, { quantity, capacity }) => acc + quantity * capacity, 0)
      )
    )
    this.props.changeGlobal("systemCost")(
      formatAs(DOLLAR)(
        Object.keys(arrays)
          .map(key => arrays[key])
          .reduce(
            (acc, { quantity, capacity, costPerWatt }) =>
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
    const { arrays } = this.state
    return (
      <Grid cols={3}>
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

              {arrays[arr].data && (
                <Data>{JSON.stringify(arrays[arr].data, null, 2)}</Data>
              )}
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
          />
        </Form>
        <Container>
          <Data>{JSON.stringify(this.props, null, 2)}</Data>
        </Container>
      </Grid>
    )
  }
}
