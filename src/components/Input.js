import React from "react"
import styled from "styled-components"
import { formatAs, parseAs } from "../functions/formats"

const Input = styled.input`
padding: 0.2rem;
font-size: 1rem;
border-radius: 6px;
border-width: 0;
background-color: ${({ empty }) => (empty ? "#e74c3c33" : "transparent")}
font-family: "SF Mono";
`

export default ({ name, type, value, title, update, formatFmt, parseFmt }) => (
  <div className="column">
    <label htmlFor={name}>{title || name}</label>
    <Input
      type={type || "text"}
      id={name}
      value={formatAs(formatFmt)(value) || ""}
      empty={!+value}
      onChange={e => update(parseAs(parseFmt)(e.target.value))}
    />
  </div>
)
