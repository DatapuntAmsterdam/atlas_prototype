export default (endpoint: string) => {
  const match = /(\w+)\/([\w-]+)\/?$/.exec(endpoint)
  if (match) {
    return match
  }
  throw Error('Could not extract ID from endpoint')
}
