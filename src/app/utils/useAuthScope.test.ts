import { renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'
import useAuthScope from './useAuthScope'
import AuthScope from '../../shared/services/api/authScope'

describe('useAuthScope', () => {
  it('isUserAuthorized should return a boolean whether user is authorized or not', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(() => [AuthScope.HrR, AuthScope.BrkRs, AuthScope.BdR])
    const { result } = renderHook(() => useAuthScope())
    expect(result.current.isUserAuthorized([AuthScope.BrkRs])).toBe(true)
    expect(result.current.isUserAuthorized([AuthScope.BrkRs, AuthScope.HrR])).toBe(true)

    // Not in scope
    expect(result.current.isUserAuthorized([AuthScope.BrkRo])).toBe(false)
    expect(result.current.isUserAuthorized([AuthScope.CatR, AuthScope.BdX])).toBe(false)
  })
})
