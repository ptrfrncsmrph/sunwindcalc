import React, { Component, Fragment } from "react"
import sMARTBaseRate from "../functions/sMARTBaseRate"

import { NUMBER } from "../functions/formats"
import Heading from "./Heading"
import Form from "./Form"
import Input from "./Input"
import InputGroup from "./InputGroup"
import Switch from "./Switch"
import Checkbox from "./Checkbox"

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
    const { systemCapacity = "0" } = this.props
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
      </Fragment>
    )
  }
}
