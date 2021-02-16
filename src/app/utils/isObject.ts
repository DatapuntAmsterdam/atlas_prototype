const isObject = (value: any): value is Record<string, unknown> =>
  value?.constructor?.name === 'Object'

export default isObject
