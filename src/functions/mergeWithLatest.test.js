import mergeWithLatest from "./mergeWithLatest"

it("mergeWithLatest overwrites app-defined state with values from local storage, but defers to the structure of the app-defined state object", () => {
  const fromLocal = {
    x: "0",
    y: "This string will be replaced by an object",
    z: {
      a: "Hello",
      b: "Yes"
    }
  }

  const fromApp = {
    x: "1",
    y: {
      a: "Hello from here"
    },
    z: {
      a: "Goodbye",
      c: "Why not?"
    }
  }

  expect(mergeWithLatest(fromLocal, fromApp)).toEqual({
    x: "0",
    y: {
      a: "Hello from here"
    },
    z: {
      a: "Hello",
      c: "Why not?"
    }
  })
})

it("mergeWithLatest can handle null from local storage", () => {
  const fromLocal = null

  const fromApp = {
    x: "1",
    y: {
      a: "Hello from here"
    },
    z: {
      a: "Goodbye",
      c: "Why not?"
    }
  }

  expect(mergeWithLatest(fromLocal, fromApp)).toEqual({
    x: "1",
    y: {
      a: "Hello from here"
    },
    z: {
      a: "Goodbye",
      c: "Why not?"
    }
  })
})
