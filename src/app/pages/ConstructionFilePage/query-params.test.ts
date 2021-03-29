import { authTokenParam, fileNameParam, fileUrlParam } from './query-params'

describe('authTokenParam', () => {
  it('encodes the parameter', () => {
    expect(authTokenParam.encode('foo')).toEqual('foo')
  })

  it('decodes the parameter', () => {
    expect(authTokenParam.decode('foo')).toEqual('foo')
  })
})

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
