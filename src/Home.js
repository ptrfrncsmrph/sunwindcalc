import React from "react"
import Grid from "./components/Grid"
import Container from "./components/Container"
import Subcontainer from "./components/Subcontainer"
import { Link } from "react-router-dom"

export default () => (
  <Grid>
    <Container>
      <Subcontainer>
        <h2>SunWind Proposal Calculator</h2>
        <p>
          Go to the <Link to="/sizing">Sizing</Link> page to get started with
          PVWatts calculator.
        </p>
        <p>
          Once submitted to PVWatts, you can go to the{" "}
          <Link to="/financing">Financing</Link> page to calculate return on
          investment and generate a table of forecasted revenue values for the
          lifetime of system.
        </p>
      </Subcontainer>
    </Container>
  </Grid>
)
