import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { createUnsecuredToken } from 'jsontokens'
import decodeToken from 'jwt-decode'
import { mocked } from 'ts-jest/utils'
import useParam from '../../utils/useParam'
import AuthTokenContext, { AuthTokenProvider, useAuthToken } from './AuthTokenContext'
import { getAccessToken } from '../../../shared/services/auth/auth'

jest.mock('../../utils/useParam')
jest.mock('../../../shared/services/auth/auth')

const useParamMock = mocked(useParam)
const getAccessTokenMock = mocked(getAccessToken)

const VALID_TOKEN = { exp: Date.now() / 1000 + 120 }
const EXPIRED_TOKEN = { exp: Date.now() / 1000 - 120 }

describe('AuthTokenProvider', () => {
  beforeEach(() => {
    useParamMock.mockReturnValue([null, () => {}])
    getAccessTokenMock.mockReturnValue('')
  })

  afterEach(() => {
    useParamMock.mockClear()
    getAccessTokenMock.mockClear()
    localStorage.clear()
  })

  it('provides an empty value if no token is set', () => {
    const Tests = () => {
      expect(useAuthToken()).toBeNull()
      return null
    }

    render(
      <AuthTokenProvider>
        <Tests />
      </AuthTokenProvider>,
    )
  })

  it('retrieves initial token from the url first', () => {
    const urlTokenValue = { ...VALID_TOKEN, from: 'url' }
    const localTokenValue = { ...VALID_TOKEN, from: 'local' }
    const urlToken = createUnsecuredToken(urlTokenValue)
    const localToken = createUnsecuredToken(localTokenValue)

    useParamMock.mockReturnValue([urlToken, () => {}])
    localStorage.setItem('AUTH_TOKEN', localToken)

    const Tests = () => {
      expect(decodeToken(useAuthToken() ?? '')).toEqual(urlTokenValue)
      return null
    }

    render(
      <AuthTokenProvider>
        <Tests />
      </AuthTokenProvider>,
    )
  })

  it('retrieves initial token from local storage if not present in the url', () => {
    const token = createUnsecuredToken(VALID_TOKEN)

    localStorage.setItem('AUTH_TOKEN', token)

    const Tests = () => {
      expect(decodeToken(useAuthToken() ?? '')).toEqual(VALID_TOKEN)
      return null
    }

    render(
      <AuthTokenProvider>
        <Tests />
      </AuthTokenProvider>,
    )
  })

  it('ignores tokens that have expired', () => {
    const token = createUnsecuredToken(EXPIRED_TOKEN)

    useParamMock.mockReturnValue([token, () => {}])

    const Tests = () => {
      expect(useAuthToken()).toBeNull()
      return null
    }

    render(
      <AuthTokenProvider>
        <Tests />
      </AuthTokenProvider>,
    )
  })

  it('stores the token from the url in local storage and clears it', () => {
    const token = createUnsecuredToken(VALID_TOKEN)
    const setItemMock = jest.spyOn(localStorage, 'setItem')
    const setParamMock = jest.fn()

    useParamMock.mockReturnValue([token, setParamMock])

    render(<AuthTokenProvider />)

    expect(setItemMock).toHaveBeenCalledWith('AUTH_TOKEN', token)
    expect(setParamMock).toHaveBeenCalledWith(null, 'replace')
  })

  it('revokes the token the if it expires over time', () => {
    const token = createUnsecuredToken(VALID_TOKEN)

    useParamMock.mockReturnValue([token, () => {}])
    jest.useFakeTimers()

    const { rerender } = render(<AuthTokenProvider />)

    // Tick the timer once to cover 'else' branch.
    jest.runOnlyPendingTimers()
    rerender(<AuthTokenProvider />)

    const dateNowMock = jest.spyOn(Date, 'now')

    dateNowMock.mockReturnValue(VALID_TOKEN.exp * 1000)
    jest.runOnlyPendingTimers()

    const Tests = () => {
      expect(useAuthToken()).toBeNull()
      return null
    }

    rerender(
      <AuthTokenProvider>
        <Tests />
      </AuthTokenProvider>,
    )

    dateNowMock.mockRestore()
  })

  it('only provides the token if the user is not signed in', () => {
    const token = createUnsecuredToken(VALID_TOKEN)

    getAccessTokenMock.mockReturnValue('FAKETOKEN')
    useParamMock.mockReturnValue([token, () => {}])

    const Tests = () => {
      expect(useAuthToken()).toBeNull()
      return null
    }

    render(
      <AuthTokenProvider>
        <Tests />
      </AuthTokenProvider>,
    )
  })
})

describe('useAuthToken', () => {
  it('provides the token', () => {
    const token = 'Hello World'
    const { result } = renderHook(() => useAuthToken(), {
      wrapper: ({ children }) => (
        <AuthTokenContext.Provider value={{ token }}>{children}</AuthTokenContext.Provider>
      ),
    })

    expect(result.current).toEqual(token)
  })
})
