const camelToSnake = str => str.replace(/([A-Z])/g, l => `_${l.toLowerCase()}`)

export default params =>
  `https://developer.nrel.gov/api/pvwatts/v5.json?api_key=iN1jnldIv9Eojvl9q9nByGdRGQMsxUddk00pWub3&${Object.entries(
    params
  )
    .map(e => `${camelToSnake(e[0])}=${e[1]}`)
    .join("&")}`
