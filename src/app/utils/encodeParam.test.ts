import encodeParam from './encodeParam'
import type { UrlParam } from './useParam'

describe('encodeParam', () => {
  it('encodes a parameter', () => {
    expect(
      encodeParam(
        {
          name: 'test',
          defaultValue: {},
          encode: (value) => JSON.stringify(value),
          decode: (value) => JSON.parse(value),
        },
        { foo: 'bar' },
      ),
    ).toEqual('{"foo":"bar"}')
  })

  it('returns null if the value matches the default value', () => {
    expect(
      encodeParam(
        {
          name: 'test',
          defaultValue: { foo: 'bar' },
          encode: (value) => JSON.stringify(value),
          decode: (value) => JSON.parse(value),
        },
        { foo: 'bar' },
      ),
    ).toEqual(null)
  })

  it('returns null if the value is null or undefined', () => {
    const param: UrlParam<{ foo: string } | null | undefined> = {
      name: 'test',
      defaultValue: { foo: 'bar' },
      encode: (value) => JSON.stringify(value),
      decode: (value) => JSON.parse(value),
    }

    expect(encodeParam(param, null)).toEqual(null)
    expect(encodeParam(param, undefined)).toEqual(null)
  })
})
