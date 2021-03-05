import { fileNameParam, fileUrlParam } from './query-params'

describe('fileNameParam', () => {
  it('encodes the parameter', () => {
    expect(fileNameParam.encode('foo')).toEqual('foo')
  })

  it('decodes the parameter', () => {
    expect(fileNameParam.decode('foo')).toEqual('foo')
  })
})

describe('fileUrlParam', () => {
  it('encodes the parameter', () => {
    expect(fileUrlParam.encode('foo')).toEqual('foo')
  })

  it('decodes the parameter', () => {
    expect(fileUrlParam.decode('foo')).toEqual('foo')
  })
})
