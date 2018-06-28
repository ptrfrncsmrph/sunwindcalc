import styled from "styled-components"

export default styled.main`
  position: absolute;
  top: 0;
  display: grid;
  height: 100vh;
  width: 100%;
  grid-template-columns: ${({ cols }) =>
    cols ? `repeat(${cols}, 1fr)` : "auto"};
  & > * {
    overflow: scroll;
    width: 100%;
    height: auto;
    max-height: 100%;
  }
  padding-left: 5rem;
  padding-right: 5rem;
  padding-top: 4rem;
  grid-gap: 1rem;
`
