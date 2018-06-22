import { parseNumFrom, NUMBER, PITCH } from "../functions/formats"

export default ({ quantity, capacity, azimuth, tilt, losses, arrayType }) => ({
  systemCapacity:
    (parseNumFrom(NUMBER)(quantity) * parseNumFrom(NUMBER)(capacity)) / 1000,
  azimuth: parseNumFrom(NUMBER)(azimuth),
  tilt: parseNumFrom(PITCH)(tilt),
  losses: parseNumFrom(NUMBER)(losses),
  arrayType: 1,
  apiKey: "iN1jnldIv9Eojvl9q9nByGdRGQMsxUddk00pWub3",
  moduleType: 0,
  lat: 41.68,
  lon: -69.96
})
