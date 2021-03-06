import React, { Component, Fragment } from "react"
import sMARTBaseRate from "../functions/sMARTBaseRate"
import { compose, map } from "ramda"

import { camelToSentence } from "../functions/helper"
import { formatAs, parseNumFrom, CENT, NUMBER } from "../functions/formats"
import Heading from "./Heading"
import Input from "./Input"
import InputGroup from "./InputGroup"
import Checkbox from "./Checkbox"
import Button from "./Button"

const stateDisplay = {
  block: "Block",
  tranche: "Tranche",
  isLowIncome: "Check this box if customer is low income",
  isNantucketElectric:
    "Check this box if customer is served by Nantucket Electric",
  adders: {
    storage: {
      capacity: "Storage capacity (kW)",
      usefulEnergy: "Storage hours at rated capacity"
    }
  }
}

export default class SMARTBaseRateCalc extends Component {
  state = {
    block: "1",
    tranche: "1",
    isLowIncome: false,
    isNantucketElectric: false,
    adders: {
      storage: {
        isActive: false,
        // Not going to compute initialValue separately,
        // so will not be part of state. The sMARTBaseRate
        // function does not care about this initialValue,
        // but I might want to display it in UI. Still, doesn't
        // need to be part of state...
        initialValue: 0,
        capacity: "0",
        usefulEnergy: "0"
      },
      location: {
        buildingMounted: {
          isActive: true,
          initialValue: 0.02
        },
        floating: {
          isActive: false,
          initialValue: 0.03
        },
        brownfield: {
          isActive: false,
          initialValue: 0.03
        },
        landfill: {
          isActive: false,
          initialValue: 0.04
        },
        canopy: {
          isActive: false,
          initialValue: 0.06
        },
        agricultural: {
          isActive: false,
          initialValue: 0.06
        }
      },
      offTaker: {
        communityShared: {
          isActive: false,
          initialValue: 0.05
        },
        lowIncomeProperty: {
          isActive: false,
          initialValue: 0.03
        },
        lowIncomeCommunityShared: {
          isActive: false,
          initialValue: 0.06
        },
        publicEntity: {
          isActive: false,
          initialValue: 0.02
        }
      }
    }
  }

  // There's a lot of hacky shit goin on here,
  // this is one of the worst offenders. Apologies
  // Future Pete. Sincerely, Past Pete
  handleCalculate = params => {
    console.log(
      Object.keys(params)
        .map(key => ({
          [key]:
            key === "initialValue"
              ? formatAs(CENT)(params[key])
              : formatAs(NUMBER)(params[key])
        }))
        .reduce((acc, x) => ({ ...acc, ...x }), {})
    )
    this.props.onValues(
      Object.keys(params)
        .map(key => ({
          [key]:
            key === "initialValue"
              ? formatAs(CENT)(params[key])
              : formatAs(NUMBER)(params[key])
        }))
        .reduce((acc, x) => ({ ...acc, ...x }), {})
    )
  }

  updateValues = values => {
    this.setState(prevState => ({
      ...prevState,
      ...values
    }))
  }

  updateNestedValues = nest => values => {
    this.setState(prevState => ({
      [nest]: {
        ...prevState[nest],
        ...values
      }
    }))
  }

  updateNestedNestedValues = nest => nest2 => values => {
    this.setState(prevState => ({
      [nest]: {
        ...prevState[nest],
        [nest2]: { ...prevState[nest][nest2], ...values }
      }
    }))
  }

  render() {
    const {
      block,
      tranche,
      isLowIncome,
      isNantucketElectric,
      adders
    } = this.state
    const { systemCapacity } = this.props
    const parsedParams = compose(map(parseNumFrom(NUMBER)))({
      block,
      tranche,
      systemCapacity
    })

    const finalParams = {
      isLowIncome,
      isNantucketElectric,
      ...parsedParams,
      adders: {
        ...adders,
        storage: {
          ...adders.storage,
          capacity: parseNumFrom(NUMBER)(adders.storage.capacity),
          usefulEnergy: parseNumFrom(NUMBER)(adders.storage.usefulEnergy)
        }
      }
    }

    return (
      <Fragment>
        <InputGroup
          values={{ block, tranche, isLowIncome, isNantucketElectric }}
          onValues={this.updateValues}
        >
          {Object.keys(this.state)
            .filter(key => typeof this.state[key] !== "object")
            .map(key => (
              <Input
                key={key}
                type={typeof this.state[key] === "boolean" && "checkbox"}
                name={key}
                title={stateDisplay[key]}
                value={this.state[key]}
                fmt={NUMBER}
              />
            ))}
        </InputGroup>
        <Heading>
          <h4>Energy storage adder</h4>
          <Checkbox
            checked={adders.storage.isActive}
            handleChange={() =>
              this.setState(({ adders: { storage } }) => ({
                adders: {
                  ...adders,
                  storage: { ...storage, isActive: !storage.isActive }
                }
              }))
            }
          />
        </Heading>
        <InputGroup
          values={this.state.adders.storage}
          onValues={this.updateNestedNestedValues("adders")("storage")}
        >
          {Object.keys(this.state.adders.storage)
            .filter(key => typeof this.state.adders.storage[key] === "string")
            .map(key => (
              <Input
                key={key}
                name={key}
                title={stateDisplay.adders.storage[key]}
                value={this.state.adders.storage[key]}
                fmt={NUMBER}
              />
            ))}
        </InputGroup>
        <Heading>
          <h4>Location adder</h4>
        </Heading>
        {Object.keys(this.state.adders.location).map(key => (
          <Fragment>
            <Checkbox
              checked={adders.location[key].isActive}
              handleChange={() =>
                this.setState(({ adders: { location } }) => ({
                  adders: {
                    ...adders,
                    location: {
                      ...location,
                      [key]: {
                        ...location[key],
                        isActive: !location[key].isActive
                      }
                    }
                  }
                }))
              }
              key={key}
              label={`${camelToSentence(key)} (${formatAs(CENT)(
                adders.location[key].initialValue
              )})`}
            />
          </Fragment>
        ))}
        <Heading>
          <h4>Off-taker adder</h4>
        </Heading>
        {Object.keys(this.state.adders.offTaker).map(key => (
          <Checkbox
            checked={adders.offTaker[key].isActive}
            handleChange={() =>
              this.setState(({ adders: { offTaker } }) => ({
                adders: {
                  ...adders,
                  offTaker: {
                    ...offTaker,
                    [key]: {
                      ...offTaker[key],
                      isActive: !offTaker[key].isActive
                    }
                  }
                }
              }))
            }
            key={key}
            label={`${camelToSentence(key)} (${formatAs(CENT)(
              adders.offTaker[key].initialValue
            )})`}
          />
        ))}
        <Button
          type="button"
          onClick={() => {
            console.log(finalParams)
            this.handleCalculate(sMARTBaseRate(finalParams))
          }}
          value="Calculate"
        />
      </Fragment>
    )
  }
}
