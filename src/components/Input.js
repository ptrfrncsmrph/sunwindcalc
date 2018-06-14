import React from "react"
import styled from "styled-components"
import { formatAs, parseFrom } from "../functions/formats"

const Input = styled.input`
  padding: 0.2rem;
  font-size: 1rem;
  border-radius: 6px;
  border-width: 0;
  background-color: ${({ empty }) => (empty ? "#e74c3c33" : "transparent")}
  text-align: right;
  &:focus {
    background-color: #f39c1233;
  }
`

const Label = styled.label`
  max-width: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr;
`

export default ({ name, type, value, title, update, formatFmt, parseFmt }) => (
  <div>
    <Label htmlFor={name}>
      {title || name}
      <Input
        type={type || "text"}
        id={name}
        value={formatAs(formatFmt)(value) || ""}
        empty={!+value}
        onChange={e => update(parseFrom(parseFmt)(e.target.value))}
      />
    </Label>
  </div>
)
