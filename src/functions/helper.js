export const camelToSentence = str =>
  str
    .replace(/[A-Z]/g, match => ` ${match.toLowerCase()}`)
    .replace(/^./, match => match.toUpperCase())
