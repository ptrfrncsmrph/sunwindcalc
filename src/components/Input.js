import React from "react"
import styled from "styled-components"
import { formatAs, parseFrom } from "../functions/formats"
import { compose } from "ramda"

const id = x => x

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
  opacity: ${({ isActive }) => (isActive ? "1" : "0.2")};
  font-family: "Circular Std";
  max-width: 800px;
  display: grid;
  grid-template-columns: 1fr 8rem;
  border-bottom: 1px dotted black;
  margin-bottom: 0.5rem;
`

export default ({ name, isActive = true, type, value, title, update, fmt }) => (
  <div>
    <Label isActive={isActive} htmlFor={name}>
      {title || name}
      <Input
        type={type || "text"}
        id={name}
        value={value || ""}
        empty={value === ""}
        onChange={e => update(e.target.value)}
        onFocus={e => update(parseFrom(fmt)(e.target.value))}
        onBlur={e =>
          compose(
            update,
            formatAs(fmt),
            parseFrom(fmt)
          )(e.target.value)
        }
      />
    </Label>
  </div>
)
