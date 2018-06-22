import React, { Component } from "react"
import Financing from "./Financing"
import Sizing from "./Sizing"

export default class App extends Component {
  state = {
    systemSize: 0,
    systemCost: 0
  }
  render() {
    return <Sizing />
  }
}
