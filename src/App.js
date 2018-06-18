import React, { Component, Fragment } from "react"
import InputGroup from "./components/InputGroup"
import Input from "./components/Input"
import {
  formatAs,
  parseAs,
  NUMBER,
  DOLLAR,
  PERCENT,
  CENT
} from "./functions/formats"
import { compose, map } from "ramda"

import styled from "styled-components"

const Form = styled.form`
  display: grid;
  justify-content: center;
  padding: 10px;
  width: 100vw;
`

const stateDisplay = {
  firstYearProduction: "First year production (in kWh)",
  annualDegradation: "Annual degradation (default is 0.05%)",
  systemCapacity: "System capacity (Watts DC)",
  systemCost: "System cost",
  taxRate: "Tax rate",
  bonusDepreciationRate: "Bonus depreciation rate (claimed first year)",
  nantucketSolar: "Nantucket solar rebate (if applicable, usually $1000)",
  sREC: {
    initialValue: "Initial value (first year)",
    annualChange: "Annual change (should be negative value)"
  },
  sMART: {
    initialValue: "Initial value (first year)",
    capYear: "Number of years (typically 10)"
  },
  netMetering: {
    initialValue: "Initial value (first year)",
    annualChange: "Annual change (should be positive value)"
  },
  maintenance: {
    initialValue: "Initial maintenance charge",
    annualChange: "Annual change (will be rounded)",
    interval: "How often will customer be charged (i.e., every _ years)?",
    start: "What year will customer start to be charged?"
  },
  insurance: {
    initialValue: "Initial insurance cost",
    annualChange: "Annual change (should be positive value)"
  },
  loan: {
    principal: "Loan principal amount",
    interest: "Interest rate",
    years: "Term of loan (in years)"
  }
}

const stateFormats = {
  firstYearProduction: NUMBER,
  annualDegradation: PERCENT,
  systemCapacity: NUMBER,
  systemCost: DOLLAR,
  taxRate: PERCENT,
  bonusDepreciationRate: PERCENT,
  nantucketSolar: DOLLAR,
  sREC: {
    initialValue: CENT,
    annualChange: PERCENT
  },
  sMART: {
    initialValue: CENT,
    capYear: NUMBER
  },
  netMetering: {
    initialValue: CENT,
    annualChange: PERCENT
  },
  maintenance: {
    initialValue: DOLLAR,
    annualChange: PERCENT,
    interval: NUMBER,
    start: NUMBER
  },
  insurance: {
    initialValue: DOLLAR,
    annualChange: PERCENT
  },
  loan: {
    principal: DOLLAR,
    interest: PERCENT,
    years: NUMBER
  }
}

const initialState = {
  firstYearProduction: 9459,
  // This is how it is on Enphase site
  // (Default is 0.5%)
  // Annual Degradation Factor
  // Percentage to reduce estimate each year to account for aging of PV modules.
  annualDegradation: "0.5",
  systemCapacity: "7920",
  systemCost: "25500",
  taxRate: "35",
  bonusDepreciationRate: "40",
  nantucketSolar: "0",
  sREC: {
    initialValue: "0.23",
    annualChange: "0"
  },
  sMART: {
    isActive: false,
    initialValue: "0.17",
    capYear: "10"
  },
  netMetering: {
    isActive: false,
    initialValue: "0.19",
    annualChange: "2"
  },
  maintenance: {
    isActive: false,
    initialValue: "300",
    annualChange: "2",
    interval: "4",
    start: "3"
  },
  insurance: {
    isActive: false,
    initialValue: "150",
    annualChange: "2"
  },
  loan: {
    isActive: false,
    principal: "26000",
    interest: "3.5",
    years: "10"
  }
}

class App extends Component {
  state = {
    firstYearProduction: 9459,
    // This is how it is on Enphase site
    // (Default is 0.5%)
    // Annual Degradation Factor
    // Percentage to reduce estimate each year to account for aging of PV modules.
    annualDegradation: "0.5",
    systemCapacity: "7920",
    systemCost: "25500",
    taxRate: "35",
    bonusDepreciationRate: "40",
    nantucketSolar: "0",
    sREC: {
      initialValue: "0.23",
      annualChange: "0"
    },
    sMART: {
      isActive: false,
      initialValue: "0.17",
      capYear: "10"
    },
    netMetering: {
      isActive: false,
      initialValue: "0.19",
      annualChange: "2"
    },
    maintenance: {
      isActive: false,
      initialValue: "300",
      annualChange: "2",
      interval: "4",
      start: "3"
    },
    insurance: {
      isActive: false,
      initialValue: "150",
      annualChange: "2"
    },
    loan: {
      isActive: false,
      principal: "26000",
      interest: "3.5",
      years: "10"
    }
  }

  componentDidMount() {
    this.setState(() =>
      Object.keys(initialState).reduce(
        (acc, e) => ({
          ...acc,
          [e]:
            typeof initialState[e] !== "object"
              ? formatAs(stateFormats[e])(initialState[e])
              : Object.keys(initialState[e]).reduce(
                  (acc, x) => ({
                    ...acc,
                    [x]:
                      typeof initialState[e][x] !== "boolean"
                        ? formatAs(stateFormats[e][x])(initialState[e][x])
                        : initialState[e][x]
                  }),
                  {}
                )
        }),
        {}
      )
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

  render() {
    const {
      firstYearProduction,
      annualDegradation,
      systemCapacity,
      systemCost,
      taxRate,
      bonusDepreciationRate,
      nantucketSolar,
      sREC,
      sMART,
      netMetering,
      maintenance,
      insurance,
      loan
    } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        <h4>System Info</h4>
        <InputGroup
          values={{
            firstYearProduction,
            annualDegradation,
            systemCapacity,
            systemCost,
            taxRate,
            bonusDepreciationRate,
            nantucketSolar
          }}
          onValues={this.updateValues}
        >
          {Object.keys(this.state)
            .filter(key => typeof this.state[key] !== "object")
            .map(key => (
              <Input
                key={key}
                name={key}
                title={stateDisplay[key]}
                value={this.state[key]}
                fmt={stateFormats[key]}
              />
            ))}
        </InputGroup>
        <h4>SREC</h4>
        <InputGroup values={sREC} onValues={this.updateNestedValues("sREC")}>
          {Object.keys(this.state.sREC).map(key => (
            <Input
              key={key}
              name={key}
              title={stateDisplay.sREC[key]}
              value={this.state.sREC[key]}
              fmt={stateFormats.sREC[key]}
            />
          ))}
        </InputGroup>
        <h4>SMART</h4>
        <InputGroup values={sMART} onValues={this.updateNestedValues("sMART")}>
          {Object.keys(this.state.sMART)
            .filter(x => typeof this.state.sMART[x] === "string")
            .map(key => (
              <Input
                key={key}
                name={key}
                title={stateDisplay.sMART[key]}
                value={String(this.state.sMART[key])}
                fmt={stateFormats.sMART[key]}
              />
            ))}
        </InputGroup>
        <h4>Net Metering</h4>
        <InputGroup
          values={netMetering}
          onValues={this.updateNestedValues("netMetering")}
        >
          {Object.keys(this.state.netMetering)
            .filter(x => typeof this.state.netMetering[x] === "string")
            .map(key => (
              <Input
                key={key}
                name={key}
                title={stateDisplay.netMetering[key]}
                value={String(this.state.netMetering[key])}
                fmt={stateFormats.netMetering[key]}
              />
            ))}
        </InputGroup>
        <h4>Maintenance</h4>
        <InputGroup
          values={maintenance}
          onValues={this.updateNestedValues("maintenance")}
        >
          {Object.keys(this.state.maintenance)
            .filter(x => typeof this.state.maintenance[x] === "string")
            .map(key => (
              <Input
                key={key}
                name={key}
                title={stateDisplay.maintenance[key]}
                value={String(this.state.maintenance[key])}
                fmt={stateFormats.maintenance[key]}
              />
            ))}
        </InputGroup>
        <h4>Insurance</h4>
        <InputGroup
          values={insurance}
          onValues={this.updateNestedValues("insurance")}
        >
          {Object.keys(this.state.insurance)
            .filter(x => typeof this.state.insurance[x] === "string")
            .map(key => (
              <Input
                key={key}
                name={key}
                title={stateDisplay.insurance[key]}
                value={String(this.state.insurance[key])}
                fmt={stateFormats.insurance[key]}
              />
            ))}
        </InputGroup>
        <h4>Loan</h4>
        <InputGroup values={loan} onValues={this.updateNestedValues("loan")}>
          {Object.keys(this.state.loan)
            .filter(x => typeof this.state.loan[x] === "string")
            .map(key => (
              <Input
                key={key}
                name={key}
                title={stateDisplay.loan[key]}
                value={String(this.state.loan[key])}
                fmt={stateFormats.loan[key]}
              />
            ))}
        </InputGroup>
      </Form>
    )
  }
}

export default App
