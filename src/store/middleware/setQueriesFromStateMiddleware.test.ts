import { mocked } from 'ts-jest/utils'
import paramsRegistry from '../params-registry'
import isIgnoredPath from './isIgnoredPath'
import setQueriesFromStateMiddleware from './setQueriesFromStateMiddleware'

jest.mock('./isIgnoredPath')

const isIgnoredPathMock = mocked(isIgnoredPath)

describe('setQueriesFromStateMiddleware', () => {
  const isRouterTypeMock = jest.spyOn(paramsRegistry, 'isRouterType')
  const setQueriesFromStateMock = jest.spyOn(paramsRegistry, 'setQueriesFromState')
  const mockStore = {
    getState: jest.fn(() => ({
      location: {
        type: '',
      },
    })),
  }

  const action = { type: 'some action', meta: { query: 'someQuery', preserve: true } }

  beforeEach(() => {
    isIgnoredPathMock.mockReturnValue(false)
  })

  afterEach(() => {
    isIgnoredPathMock.mockClear()
  })

  it('skips ignored paths', () => {
    isIgnoredPathMock.mockReturnValue(true)

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).not.toHaveBeenCalled()
    expect(isRouterTypeMock).not.toHaveBeenCalled()
  })

  it('handles normal paths', () => {
    isIgnoredPathMock.mockReturnValue(false)

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).toHaveBeenCalled()
    expect(isRouterTypeMock).toHaveBeenCalled()
  })
})
