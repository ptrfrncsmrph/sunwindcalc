import React, { Component, Fragment } from "react"
import { Route } from "react-router-dom"

import Financing from "./Financing"
import Sizing from "./Sizing"
import Nav from "./components/Nav"
import Dummy from "./containers/Dummy"
import Home from "./Home"

export default class App extends Component {
  state = {
    firstYearProduction: "",
    systemCapacity: "",
    systemCost: ""
  }
  handleChange = key => value => {
    this.setState(() => ({ [key]: value }))
  }
  render() {
    return (
      <Fragment>
        <Nav />
        <Route exact path="/" render={() => <Home />} />
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
