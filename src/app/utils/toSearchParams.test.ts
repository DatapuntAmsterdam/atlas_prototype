import type { UrlParam } from './useParam'
import toSearchParams from './toSearchParams'

describe('toSearchParams', () => {
  const numParam: UrlParam<number> = {
    name: 'number',
    defaultValue: 0,
    decode: (value) => Number(value),
    encode: (value) => value.toString(),
  }

  const stringParam: UrlParam<string> = {
    name: 'string',
    defaultValue: '',
    decode: (value) => value,
    encode: (value) => value,
  }

  it('encodes the parameters', () => {
    const params = toSearchParams([
      [numParam, 42],
      [stringParam, 'Hello World'],
    ])

    expect(params.toString()).toEqual('number=42&string=Hello+World')
  })

  it('encodes the parameters while preserving the initial value', () => {
    const initialValue = new URLSearchParams({ foo: 'bar', [numParam.name]: '11' })
    const params = toSearchParams(
      [
        [numParam, 42],
        [stringParam, 'Hello World'],
      ],
      {
        initialValue,
      },
    )

    expect(params.toString()).toEqual('foo=bar&number=42&string=Hello+World')
  })

  it('encodes the parameters removing empty entries from the initial value', () => {
    const initialValue = new URLSearchParams({
      [numParam.name]: '42',
      [stringParam.name]: 'Hello World!',
    })
    const params = toSearchParams(
      [
        [numParam, 0],
        [stringParam, ''],
      ],
      {
        initialValue,
      },
    )

    expect(params.toString()).toEqual('')
  })
})
