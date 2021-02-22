const isObject = (value: any): value is object => value !== null && typeof value === 'object'

export default isObject
