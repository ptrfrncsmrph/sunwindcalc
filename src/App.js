import React, { Component, Fragment } from "react"
import { Route } from "react-router-dom"

import Financing from "./Financing"
import Sizing from "./Sizing"
import Nav from "./components/Nav"
import Dummy from "./containers/Dummy"

export default class App extends Component {
  state = {
    firstYearProduction: "692099",
    annualDegradation: "0.5",
    systemCapacity: "7920",
    systemCost: "25500"
  }
  handleChange = key => value => {
    this.setState(() => ({ [key]: value }))
  }
  render() {
    return (
      <Fragment>
        <Nav />
        <Route
          path="/sizing"
          render={() => (
            <Sizing changeGlobal={this.handleChange} global={this.state} />
          )}
        />
        <Route
          path="/financing"
          render={() => <Financing global={this.state} />}
        />
        <Route path="/dummy" component={Dummy} />
      </Fragment>
    )
  }
}
