import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const StyledLink = styled(Link)`
  text-decoration: none;
`

const Nav = styled.nav`
  position: fixed;
  padding: 2rem 10rem 2rem 10rem;
  top: 0;
  width: 100vw;
  background-color: #ecf0f1ff;
  box-shadow: 0 2px 10px #ecf0f166;
`

const UL = styled.ul`
  display: grid;
  width: 100%;
  list-style: none;
  grid-auto-flow: column;
  margin: 0;
  padding: 0;
  & > li {
    text-align: center;
  }
`

export default () => (
  <Nav>
    <UL>
      <li>
        <StyledLink to="/sizing">Sizing</StyledLink>
      </li>
      <li>
        <StyledLink to="/financing">Financing</StyledLink>
      </li>
      <li>
        <StyledLink to="/dummy">Dummy Table</StyledLink>
      </li>
    </UL>
  </Nav>
)
