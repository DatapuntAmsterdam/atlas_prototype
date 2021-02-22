const isObject = (value: any): value is Record<string, unknown> =>
  value !== null && typeof value === 'object'

export default isObject
