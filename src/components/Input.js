import React from "react"
import styled from "styled-components"
import { formatAs, parseFrom } from "../functions/formats"
import { compose } from "ramda"
import Checkbox from "./Checkbox"

const Input = styled.input`
  padding: 0.2rem;
  font-size: 1rem;
  border-radius: 6px;
  border-width: 0;
  background-color: ${({ empty }) => (empty ? "#e74c3c33" : "transparent")}
  text-align: right;
  &:focus {
    background-color: #f39c1233;
    border: none;
  }
`

const Label = styled.label`
  display: ${({ isActive }) => (isActive ? "grid" : "none")};
  font-family: var(--sans-font);
  align-items: end;
  grid-template-columns: 1fr 5rem;
  border-bottom: 1px dotted black;
  margin-bottom: 0.5rem;
`

export default ({
  name,
  isActive = true,
  type,
  value,
  title,
  update,
  updateChecked,
  fmt
}) => (
  <div>
    <Label isActive={isActive} htmlFor={name}>
      {title || name}
      {type === "checkbox" ? (
        <Checkbox
          id={name}
          checked={value}
          handleChange={() => updateChecked(value)}
        />
      ) : (
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
      )}
    </Label>
  </div>
)
