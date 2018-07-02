import React, { Component } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

const Container = styled.div`
  display: flex;
  justify-self: right;
  align-items: center;
  transition: 0.2s all;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
  opacity: ${props => (props.disabled ? "0.5" : "1")};
`

const SVG = styled.svg`
  shape-rendering: crispEdges;
  width: 1rem;
  height: 1rem;
  stroke-width: 2px;
  stroke: black;
  fill: none;
  margin: 0.25rem;
  & rect:first-of-type {
    fill: ${({ checked }) => (checked ? "black" : "transparent")};
    stroke: none;
  }
`

const CheckboxSVG = ({ checked }) => (
  <SVG checked={checked} viewbox="0 0 14 14">
    <rect x="3" y="3" width="8" height="8" />
    <rect x="1" y="1" width="12" height="12" />
  </SVG>
)

export default ({
  checked,
  disabled = false,
  id,
  handleChange,
  label = ""
}) => (
  <Container disabled={disabled} onClick={!disabled && handleChange}>
    <CheckboxSVG checked={checked} />
    {label && <span>{label}</span>}
  </Container>
)
