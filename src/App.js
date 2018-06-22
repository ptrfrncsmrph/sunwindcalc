import React, { Component, Fragment } from "react"
import { Route } from "react-router-dom"

import Financing from "./Financing"
import Sizing from "./Sizing"
import Nav from "./components/Nav"
import Dummy from "./containers/Dummy"

export default class App extends Component {
  state = {
    systemSize: 0,
    systemCost: 0
  }
  render() {
    return (
      <Fragment>
        <Nav />
        <Route path="/sizing" component={Sizing} />
        <Route path="/financing" component={Financing} />
        <Route path="/dummy" component={Dummy} />
      </Fragment>
    )
  }
}
