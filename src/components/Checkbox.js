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
  <SVG checked={checked} viewbox="0 0 16 16">
    <rect x="3" y="3" width="10" height="10" />
    <rect x="0" y="0" width="16" height="16" />
  </SVG>
)

export default ({ checked, disabled = false, id, handleChange }) => (
  <Container disabled={disabled} onClick={!disabled && handleChange}>
    <CheckboxSVG checked={checked} />
  </Container>
)
