import styled from "styled-components"

export default styled.div`
  grid-column: ${({ span }) => (span ? `span ${span}` : "auto")};
  display: grid;
  height: auto;
  max-height: 100vh;
  min-width: 0;
  width: 100%;
  overflow: scroll;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, 1fr)`};
}
  grid-gap: 1rem;
`
