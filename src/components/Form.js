import styled from "styled-components"

export default styled.form`
  display: grid;
  grid-template-columns: ${({ cols }) =>
    cols ? `repeat(${cols}, 1fr)` : "auto"};
  grid-column-gap: 0.5rem;
`
