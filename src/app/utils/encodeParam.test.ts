import encodeParam from './encodeParam'

describe('encodeParam', () => {
  it('should encode a parameter', () => {
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

  it('should return null if the value matches the default value', () => {
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
})
