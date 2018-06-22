import React, { Component, Fragment } from "react"
import uuidv1 from "uuid"
import styled from "styled-components"

import Button from "./components/Button"
import Form from "./components/Form"
import Heading from "./components/Heading"
import Input from "./components/Input"
import InputGroup from "./components/InputGroup"
import { NUMBER, PITCH, PERCENT } from "./functions/formats"

import fetchData from "./api/fetchData"

const trace = msg => x => {
  console.log(msg, x)
  return x
}

const Data = styled.pre`
  font-family: "SF Mono";
  padding: 0.5rem;
  background-color: whitesmoke;
  border-radius: 6px;
`

const Err = Data.extend`
  background-color: tomato;
`

const defaultArrayState = {
  quantity: "20",
  capacity: "330",
  losses: "14",
  tilt: "8:12",
  azimuth: "180"
}
const arrayFormats = {
  quantity: NUMBER,
  capacity: NUMBER,
  losses: PERCENT,
  tilt: PITCH,
  azimuth: NUMBER
}
const arrayDisplay = {
  quantity: "Quantity of panels",
  capacity: "Capacity of panels (Watts DC)",
  losses: "Percentage of losses (14% typical)",
  tilt: "Tilt (in degrees or roof pitch)",
  azimuth: "Azimuth (degrees)"
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
    this.setState(({ arrays }) => ({
      arrays: {
        ...arrays,
        [key]: defaultArrayState
      }
    }))
  }

  deleteArray = arr => {
    this.setState(({ arrays }) => ({
      arrays: Object.keys(arrays)
        .filter(key => key !== arr)
        .reduce(
          (acc, x) => ({
            ...acc,
            x: arrays[x]
          }),
          {}
        )
    }))
  }

  updateArray = key => values => {
    this.setState(({ arrays }) => ({
      arrays: { ...arrays, [key]: { ...values } }
    }))
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
          this.setState(({ arrays }) => ({
            arrays: {
              ...arrays,
              [arr]: {
                ...arrays[arr],
                data
              }
            }
          }))
      )
    )
  }

  render() {
    const { arrays } = this.state
    return (
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
    )
  }
}
