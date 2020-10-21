import { renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'
import useAuthScope from './useAuthScope'
import AuthScope from '../../shared/services/api/authScope'

describe('useAuthScope', () => {
  it('isUserAuthorized should return a boolean whether user is authorized or not', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(() => [AuthScope.HR_R, AuthScope.BRK_RS, AuthScope.BD_R])
    const { result } = renderHook(() => useAuthScope())
    expect(result.current.isUserAuthorized([AuthScope.BRK_RS])).toBe(true)
    expect(result.current.isUserAuthorized([AuthScope.BRK_RS, AuthScope.HR_R])).toBe(true)

    // Not in scope
    expect(result.current.isUserAuthorized([AuthScope.BRK_RO])).toBe(false)
    expect(result.current.isUserAuthorized([AuthScope.CAT_R, AuthScope.BD_X])).toBe(false)
  })
})
