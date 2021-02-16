const isObject = (value: any): value is Record<string, unknown> =>
  Array.isArray(value) || value?.constructor?.name === 'Object'

export default isObject
