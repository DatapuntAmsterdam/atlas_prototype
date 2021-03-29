import { mocked } from 'ts-jest/utils'
import paramsRegistry from '../params-registry'
import isIgnoredPath from './isIgnoredPath'
import preserveUrlParametersMiddleware from './preserveUrlParametersMiddleware'

jest.mock('./isIgnoredPath')

const isIgnoredPathMock = mocked(isIgnoredPath)

describe('preserveUrlParametersMiddleware', () => {
  const getParametersForRouteMock = jest.spyOn(paramsRegistry, 'getParametersForRoute')
  const nextMockPreserveUrlParametersMiddleware = jest.fn()
  const action = { type: 'some action', meta: { query: 'someQuery', preserve: true } }

  beforeEach(() => {
    isIgnoredPathMock.mockReturnValue(false)
  })

  afterEach(() => {
    isIgnoredPathMock.mockClear()
  })

  it('skips ignored paths', () => {
    isIgnoredPathMock.mockReturnValue(true)

    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)

    expect(nextMockPreserveUrlParametersMiddleware).toHaveBeenCalledWith(action)
    expect(getParametersForRouteMock).not.toHaveBeenCalled()
  })

  it('uses the middleware for other paths', () => {
    isIgnoredPathMock.mockReturnValue(false)

    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)

    expect(getParametersForRouteMock).toHaveBeenCalled()
  })
})
