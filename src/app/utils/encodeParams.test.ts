import type { UrlParam } from './useParam'
import encodeParams from './encodeParams'

describe('encodeParams', () => {
  const booleanParam: UrlParam<boolean> = {
    name: 'boolean',
    defaultValue: false,
    decode: (value) => value === 'true',
    encode: (value) => value.toString(),
  }

  const stringParam: UrlParam<string> = {
    name: 'string',
    defaultValue: '',
    decode: (value) => value,
    encode: (value) => value,
  }

  const numberParam: UrlParam<number> = {
    name: 'number',
    defaultValue: 0,
    decode: (value) => Number(value),
    encode: (value) => value.toString(),
  }

  it('encodes the parameters', () => {
    const params = encodeParams(
      [numberParam, 42],
      [booleanParam, false], // Should be omitted as it matches the default.
      [stringParam, 'Hello World'],
    )

    expect(params).toEqual({ number: '42', string: 'Hello World' })
  })
})
