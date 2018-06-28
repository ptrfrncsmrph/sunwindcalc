import styled from "styled-components"

export default styled.section`
  display: grid;
  height: auto;
  max-height: 100vh;
  width: 100%;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, 1fr)`};
  & > * {
    overflow: scroll;
    width: 100%;
    height: auto;
    max-height: 100%;
  }
  grid-gap: 1rem;
`
