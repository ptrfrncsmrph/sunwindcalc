import React, { Component, Fragment } from "react"
import InputGroup from "./components/InputGroup"
import Input from "./components/Input"
import { formatAs, parseAs } from "./functions/formats"
import { compose } from "ramda"

import styled from "styled-components"

const Form = styled.form`
  padding: 10px;
  font-family: "SF Mono";
`

class App extends Component {
  state = {
    firstYearProduction: "9498",
    annualDegradation: "0.005",
    systemCapacity: "7920",
    systemCost: "25500",
    taxRate: "0.35",
    bonusDepreciationRate: "0.4",
    nantucketSolar: "0",
    sREC: {
      initialValue: "0.23",
      annualChange: "0"
    },
    sMART: {
      initialValue: "0.17",
      capYear: "10"
    },
    netMetering: {
      initialValue: "0.19",
      annualChange: "0.02"
    },
    maintenance: {
      initialValue: "300",
      annualChange: "0.02",
      interval: "4",
      start: "3"
    },
    insurance: {
      initialValue: "150",
      annualChange: "0.02"
    },
    loan: {
      principal: "26000",
      interest: "0.035",
      years: "10"
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
                value={this.state[key]}
                formatFmt={"NUMBER"}
                parseFmt={"NUMBER"}
              />
            ))}
        </InputGroup>
        <h4>SREC</h4>
        <InputGroup values={sREC} onValues={this.updateNestedValues("sREC")}>
          {Object.keys(this.state.sREC).map(key => (
            <Input
              key={key}
              name={key}
              value={this.state.sREC[key]}
              formatFmt={"NUMBER"}
              parseFmt={"NUMBER"}
            />
          ))}
        </InputGroup>
        <h4>SMART</h4>
        <InputGroup values={sMART} onValues={this.updateNestedValues("sMART")}>
          {Object.keys(this.state.sMART).map(key => (
            <Input key={key} name={key} value={String(this.state.sMART[key])} />
          ))}
        </InputGroup>
        <h4>Net Metering</h4>
        <InputGroup
          values={netMetering}
          onValues={this.updateNestedValues("netMetering")}
        >
          {Object.keys(this.state.netMetering).map(key => (
            <Input
              key={key}
              name={key}
              value={String(this.state.netMetering[key])}
            />
          ))}
        </InputGroup>
        <h4>Maintenance</h4>
        <InputGroup
          values={maintenance}
          onValues={this.updateNestedValues("maintenance")}
        >
          {Object.keys(this.state.maintenance).map(key => (
            <Input
              key={key}
              name={key}
              value={String(this.state.maintenance[key])}
            />
          ))}
        </InputGroup>
        <h4>Insurance</h4>
        <InputGroup
          values={insurance}
          onValues={this.updateNestedValues("insurance")}
        >
          {Object.keys(this.state.insurance).map(key => (
            <Input
              key={key}
              name={key}
              value={String(this.state.insurance[key])}
            />
          ))}
        </InputGroup>
        <h4>Loan</h4>
        <InputGroup values={loan} onValues={this.updateNestedValues("loan")}>
          {Object.keys(this.state.loan).map(key => (
            <Input key={key} name={key} value={String(this.state.loan[key])} />
          ))}
        </InputGroup>
      </Form>
    )
  }
}

export default App
