export const camelToSentence = str =>
  str
    .replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")
    .replace(/\w*/, m => `${m.charAt(0).toUpperCase()}${m.slice(1)}`)
    .replace(/(?=\w*) (\w*)/g, m => `${m.toLowerCase()}`)

camelToSentence("sMARTProgram") //?
