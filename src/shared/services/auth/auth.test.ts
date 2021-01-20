import nodeCrypto from 'crypto'
import {
  getAuthHeaders,
  getName,
  getReturnPath,
  getScopes,
  initAuth,
  isAuthenticated,
  login,
  STATE_TOKEN,
} from './auth'

// valid token that has a 'sub' prop of value 'Henk' and a 'scopes' prop with value ['foo', 'bar', 'baz']
const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiZm9vIiwiYmFyIiwiYmF6Il0sInN1YiI6IkhlbmsiLCJpYXQiOjE1ODgxNjQ1MjAsImV4cCI6MjkxMDYxNTEwMiwianRpIjoiYmE4N2U3NjYtODk0My00NGRiLTlhNzctYTA3MjlkODAyNGE0In0.Oy83ApF3On8k-L5EWfAgCRbrAX3EszzzUIZwRHiguaY'

describe('The auth service', () => {
  describe('login', () => {
    it('throws when crypto lib is not available', () => {
      expect(() => {
        login()
      }).toThrow(/crypto library is not available/)
    })
  })

  describe('auth', () => {
    beforeAll(() => {
      Object.defineProperties(global, {
        window: {
          writable: false,
          value: {
            ...global.window,
            crypto: {
              getRandomValues: (buffer: any): string => nodeCrypto.randomFillSync(buffer),
            },
          },
        },
      })

      Object.defineProperties(window, {
        location: {
          writable: true,
          value: {
            ...global.location,
            assign: jest.fn(),
            reload: jest.fn(),
          },
        },
      })
    })

    describe('init function', () => {
      describe('receiving response errors from the auth service', () => {
        it('throws an error', () => {
          window.location.search = '?error=invalid_request&error_description=invalid%20request'

          expect(sessionStorage.removeItem).not.toHaveBeenCalledWith(['stateToken'])

          expect(() => {
            initAuth()
          }).toThrow(/Authorization service responded with error/)

          expect(sessionStorage.removeItem).toHaveBeenCalledWith('stateToken')
        })

        it('does not handle any errors without an error in the query string', () => {
          window.location.search = '?'

          expect(() => {
            initAuth()
          }).not.toThrow()

          expect(sessionStorage.removeItem).not.toHaveBeenCalledWith(['stateToken'])
        })
      })

      describe('receiving a successful callback from the auth service', () => {
        beforeEach(() => {
          global.setValidAuthentication()
        })

        it('throws an error when the state token received does not match the one saved', () => {
          window.location.hash =
            '#access_token=123AccessToken&token_type=token&expires_in=36000&state=invalidStateToken'

          expect(() => {
            initAuth()
          }).toThrow(/Authenticator encountered an invalid state token/)
        })

        it('Updates the session storage', () => {
          const accessToken = sessionStorage.getItem(STATE_TOKEN)
          window.location.hash = `#access_token=${accessToken}&token_type=token&expires_in=36000&state=${accessToken}`

          initAuth()

          expect(sessionStorage.setItem).toHaveBeenCalledWith('accessToken', accessToken)
          expect(sessionStorage.getItem).toHaveBeenCalledWith('returnPath')
          expect(sessionStorage.removeItem).toHaveBeenCalledWith('returnPath')
          expect(sessionStorage.removeItem).toHaveBeenCalledWith('stateToken')
        })

        it('Deletes the sessionStorage when token is expired', () => {
          global.setExpiredAuthentication()

          initAuth()

          expect(sessionStorage.clear).toHaveBeenCalled()
          expect(window.location.reload).toHaveBeenCalledWith()
        })

        it('Does not work when a parameter is missing', () => {
          const accessToken = sessionStorage.getItem(STATE_TOKEN)
          window.location.hash = `#access_token=${accessToken}&token_type=token&state=${accessToken}`

          initAuth()

          expect(global.sessionStorage.setItem).not.toHaveBeenLastCalledWith([
            'accessToken',
            '123AccessToken',
          ])

          expect(global.sessionStorage.removeItem).not.toHaveBeenLastCalledWith(['returnPath'])
          expect(global.sessionStorage.removeItem).not.toHaveBeenLastCalledWith(['stateToken'])
        })
      })
    })

    describe('Retrieving the return path', () => {
      it('returns the return path after initialized with a successful callback', () => {
        global.setValidAuthentication()

        const returnPath = 'http://localhost:3000/some-page'
        window.location.href = returnPath

        // logging in will reset storage, set return path in storage and redirect to auth server
        login()

        const accessToken = sessionStorage.getItem(STATE_TOKEN)

        // simulating coming back from auth server
        window.location.hash = `#access_token=${accessToken}&token_type=bearer&expires_in=36000&state=${accessToken}`

        initAuth()

        expect(getReturnPath()).toBe(returnPath)
      })

      it('returns an empty string when the callback was unsuccessful', () => {
        initAuth()
        expect(getReturnPath()).toBe('')
      })

      it('returns an empty string when there was an error callback', () => {
        window.location.search = '?error=invalid_request&error_description=invalid%20request'

        expect(() => {
          initAuth()
        }).toThrow()

        expect(getReturnPath()).toBe('')
      })
    })

    describe('getAuthHeaders', () => {
      it('returns an object without headers for invalid or missing tokens', () => {
        global.unsetAuthentication()

        expect(Object.keys(getAuthHeaders())).toHaveLength(0)

        global.setInvalidAuthentication()

        expect(Object.keys(getAuthHeaders())).toHaveLength(0)

        global.setExpiredAuthentication()

        expect(Object.keys(getAuthHeaders())).toHaveLength(0)
      })

      it('returns the headers', () => {
        global.setValidAuthentication()

        expect(Object.keys(getAuthHeaders())).toEqual(['Authorization'])
      })
    })

    describe('getScopes', () => {
      it('returns an empty value for an missing token', () => {
        global.unsetAuthentication()

        expect(getScopes()).toEqual([])
      })

      it('returns an empty value for an invalid token', () => {
        global.setInvalidAuthentication()

        expect(getScopes()).toEqual([])
      })

      it('returns an empty value for an unparseable token', () => {
        const unparseableToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
        global.setAuthenticationWithToken(unparseableToken)

        expect(getScopes()).toEqual([])
      })

      it('returns the scopes', () => {
        global.setAuthenticationWithToken(token)

        expect(getScopes()).toEqual(['foo', 'bar', 'baz'])
      })
    })

    describe('getName', () => {
      it('returns an empty value for an missing token', () => {
        global.unsetAuthentication()

        expect(getName()).toEqual('')
      })

      it('returns an empty value for an invalid token', () => {
        global.setInvalidAuthentication()

        expect(getName()).toEqual('')
      })

      it('returns an empty value for an unparseable token', () => {
        const unparseableToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
        global.setAuthenticationWithToken(unparseableToken)

        expect(getName()).toEqual('')
      })

      it('returns the name', () => {
        global.setAuthenticationWithToken(token)

        expect(getName()).toEqual('Henk')
      })
    })

    describe('isAuthenticated', () => {
      it('returns false for expired token', () => {
        global.setExpiredAuthentication()

        expect(isAuthenticated()).toEqual(false)
      })

      it('returns false for invalid token', () => {
        global.setInvalidAuthentication()

        expect(isAuthenticated()).toEqual(false)
      })

      it('returns false for an unparseable token', () => {
        const unparseableToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
        global.setAuthenticationWithToken(unparseableToken)

        expect(isAuthenticated()).toEqual(false)
      })

      it('returns true for valid token', () => {
        global.setValidAuthentication()

        expect(isAuthenticated()).toEqual(true)
      })
    })
  })
})
