import React, { Component, Fragment } from "react"
import InputGroup from "./components/InputGroup"
import Input from "./components/Input"
import { formatAs, parseAs } from "./functions/formats"
import { compose } from "ramda"

import styled from "styled-components"

const Form = styled.form`
  display: grid;
  justify-content: center;
  padding: 10px;
  width: 100vw;
`

class App extends Component {
  state = {
    firstYearProduction: "9498",
    // This is how it is on Enphase site
    // (Default is 0.5%)
    // Annual Degradation Factor
    // Percentage to reduce estimate each year to account for aging of PV modules.
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
      isActive: false,
      initialValue: "0.17",
      capYear: "10"
    },
    netMetering: {
      isActive: false,
      initialValue: "0.19",
      annualChange: "0.02"
    },
    maintenance: {
      isActive: false,
      initialValue: "300",
      annualChange: "0.02",
      interval: "4",
      start: "3"
    },
    insurance: {
      isActive: false,
      initialValue: "150",
      annualChange: "0.02"
    },
    loan: {
      isActive: false,
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
          {Object.keys(this.state.sMART)
            .filter(x => typeof this.state.sMART[x] === "string")
            .map(key => (
              <Input
                key={key}
                name={key}
                value={String(this.state.sMART[key])}
                formatFmt={"NUMBER"}
                parseFmt={"NUMBER"}
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
                value={String(this.state.netMetering[key])}
                formatFmt={"NUMBER"}
                parseFmt={"NUMBER"}
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
                value={String(this.state.maintenance[key])}
                formatFmt={"NUMBER"}
                parseFmt={"NUMBER"}
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
                value={String(this.state.insurance[key])}
                formatFmt={"NUMBER"}
                parseFmt={"NUMBER"}
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
                value={String(this.state.loan[key])}
                formatFmt={key === "interest" ? "PERCENT" : "NUMBER"}
                parseFmt={key === "interest" ? "PERCENT" : "NUMBER"}
              />
            ))}
        </InputGroup>
      </Form>
    )
  }
}

export default App
