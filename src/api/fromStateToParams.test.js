import fromStateToParams from "./fromStateToParams"

it("fromStateToParams gives us valid formatted parameters", () => {
  const parametersExpected = {
    apiKey: "iN1jnldIv9Eojvl9q9nByGdRGQMsxUddk00pWub3",
    systemCapacity: 6.6,
    moduleType: 0,
    losses: 14,
    arrayType: 1,
    tilt: 33.7,
    azimuth: 180,
    lat: 41.68,
    lon: -69.96
  }
  const parametersInput = {
    quantity: "20",
    capacity: "330",
    losses: "14",
    tilt: "8:12",
    azimuth: "180"
  }

  expect(fromStateToParams(parametersInput)).toEqual(parametersExpected)
})
