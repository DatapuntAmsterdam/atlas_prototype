import { renderHook } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import AuthScope from '../../shared/services/api/authScope'
import { getScopes } from '../../shared/services/auth/auth'
import useAuthScope from './useAuthScope'

jest.mock('../../shared/services/auth/auth')

const mockedGetScopes = mocked(getScopes)

describe('useAuthScope', () => {
  it('isUserAuthorized should return a boolean whether user is authorized or not', () => {
    mockedGetScopes.mockReturnValue([AuthScope.HrR, AuthScope.BrkRs, AuthScope.BdR])

    const { result } = renderHook(() => useAuthScope())
    expect(result.current.isUserAuthorized([AuthScope.BrkRs])).toBe(true)
    expect(result.current.isUserAuthorized([AuthScope.BrkRs, AuthScope.HrR])).toBe(true)

    // Not in scope
    expect(result.current.isUserAuthorized([AuthScope.BrkRo])).toBe(false)
    expect(result.current.isUserAuthorized([AuthScope.CatR, AuthScope.BdX])).toBe(false)
  })
})
