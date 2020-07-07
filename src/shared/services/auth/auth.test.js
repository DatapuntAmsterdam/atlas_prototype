/**
 * @jest-environment jsdom-global
 */

import {
  encodedScopes,
  getAuthHeaders,
  getName,
  getReturnPath,
  getScopes,
  initAuth,
  login,
  logout,
} from './auth'
import queryStringParser from '../query-string-parser/query-string-parser'
import stateTokenGenerator from '../state-token-generator/state-token-generator'
import parseAccessToken from '../access-token-parser/access-token-parser'
import environment from '../../../environment'

jest.mock('../query-string-parser/query-string-parser')
jest.mock('../state-token-generator/state-token-generator')
jest.mock('../access-token-parser/access-token-parser')

const notExpiredTimestamp = () => Math.floor(new Date().getTime() / 1000) + 1000

describe('The auth service', () => {
  const noop = () => {}

  let queryObject
  let savedAccessToken
  let savedReturnPath
  let savedStateToken
  let stateToken
  let notExpiredAccesToken

  beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: (key) => {
          switch (key) {
            case 'accessToken':
              return savedAccessToken
            case 'stateToken':
              return savedStateToken
            case 'returnPath':
              return savedReturnPath
            default:
              return ''
          }
        },
        setItem: noop,
        removeItem: noop,
        clear: noop,
      },
    })

    jest.spyOn(global.sessionStorage, 'getItem')
    jest.spyOn(global.sessionStorage, 'removeItem')
    jest.spyOn(global.sessionStorage, 'setItem')
    jest.spyOn(global.sessionStorage, 'clear')

    queryStringParser.mockImplementation(() => queryObject)
    stateTokenGenerator.mockImplementation(() => stateToken)
    notExpiredAccesToken = { expiresAt: notExpiredTimestamp() }
    parseAccessToken.mockImplementation(() => ({ ...notExpiredAccesToken }))

    queryObject = {}
    stateToken = '123StateToken'
    savedStateToken = ''
    savedReturnPath = ''
    savedAccessToken = ''
  })

  describe('init funtion', () => {
    describe('receiving response errors from the auth service', () => {
      it('throws an error', () => {
        const queryString = '?error=invalid_request&error_description=invalid%20request'
        jsdom.reconfigure({ url: `https://data.amsterdam.nl/${queryString}` })
        queryObject = {
          error: 'invalid_request',
          error_description: 'invalid request',
        }

        expect(() => {
          initAuth()
        }).toThrow(
          'Authorization service responded with error invalid_request [invalid request] ' +
            '(The request is missing a required parameter, includes an invalid parameter value, ' +
            'includes a parameter more than once, or is otherwise malformed.)',
        )
        expect(queryStringParser).toHaveBeenCalledWith(queryString)
      })

      it('throws an error without a description in the query string', () => {
        queryObject = {
          error: 'invalid_request',
        }

        expect(() => {
          initAuth()
        }).toThrow()
      })

      it('removes the state token from the session storage', () => {
        queryObject = {
          error: 'invalid_request',
        }

        expect(() => {
          initAuth()
        }).toThrow()
        expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('stateToken')
      })

      it('does not handle any errors without an error in the query string', () => {
        queryObject = {}

        expect(() => {
          initAuth()
        }).not.toThrow()
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith(['stateToken'])
      })

      it('does not handle any errors without a query string', () => {
        queryObject = undefined

        expect(() => {
          initAuth()
        }).not.toThrow()
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith(['stateToken'])
      })
    })

    describe('receiving a successful callback from the auth service', () => {
      it('throws an error when the state token received does not match the one saved', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=invalidStateToken'
        global.location.hash = `#${queryString}`
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: 'invalidStateToken',
        }
        savedStateToken = '123StateToken'

        expect(() => {
          initAuth()
        }).toThrow('Authenticator encountered an invalid state token (invalidStateToken)')
        expect(queryStringParser).toHaveBeenCalledWith(queryString)
      })

      it('Updates the session storage', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=123StateToken'
        global.location.hash = queryString
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: '123StateToken',
        }
        savedStateToken = '123StateToken'
        savedReturnPath = '/path/leading/back'

        initAuth()
        expect(global.sessionStorage.setItem).toHaveBeenCalledWith('accessToken', '123AccessToken')
        expect(global.sessionStorage.getItem).toHaveBeenCalledWith('returnPath')
        expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('returnPath')
        expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('stateToken')
      })

      it('Deletes the sessionStorage when token is expired', () => {
        const { location } = window
        delete window.location
        window.location = {
          reload: jest.fn(),
        }

        parseAccessToken.mockImplementation(() => ({ expiresAt: 0 }))
        global.sessionStorage.getItem.mockReturnValueOnce('123AccessToken')
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=0&state=123StateToken'
        global.location.hash = queryString
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '0',
          state: '123StateToken',
        }
        savedStateToken = ''
        savedReturnPath = '/path/leading/back'

        initAuth()
        expect(global.sessionStorage.clear).toHaveBeenCalled()
        expect(window.location.reload).toHaveBeenCalledWith()
        window.location = location
      })

      it('Works when receiving unexpected parameters', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=123StateToken&extra=sauce'
        global.location.hash = queryString
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: '123StateToken',
          extra: 'sauce',
        }
        savedStateToken = '123StateToken'
        savedReturnPath = '/path/leading/back'

        initAuth()
        expect(global.sessionStorage.setItem).toHaveBeenCalledWith('accessToken', '123AccessToken')
      })

      it('Does not work when a parameter is missing', () => {
        const queryString = '?access_token=123AccessToken&token_type=token&state=123StateToken'
        global.location.hash = queryString
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          state: '123StateToken',
        }
        savedStateToken = '123StateToken'

        initAuth()
        expect(global.sessionStorage.setItem).not.toHaveBeenCalledWith([
          'accessToken',
          '123AccessToken',
        ])
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith(['returnPath'])
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith(['stateToken'])
      })
    })
  })

  describe('Login process', () => {
    it('throws an error when the crypto library is not supported by the browser', () => {
      stateToken = ''
      expect(() => {
        login()
      }).toThrow('crypto library is not available on the current browser')
    })

    it('Updates the session storage', () => {
      const hash = '#?the=current-hash'
      global.location.hash = hash

      login()

      expect(global.sessionStorage.clear).toHaveBeenCalled()
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith('stateToken', stateToken)
    })

    it('Redirects to the auth service', () => {
      const { location } = window
      delete window.location
      const assignMock = jest.fn()
      window.location = {
        reload: jest.fn(),
        assign: assignMock,
        protocol: 'https:',
        host: 'data.amsterdam.nl',
      }

      login()

      expect(assignMock).toHaveBeenCalledWith(
        `${environment.API_ROOT}oauth2/authorize?idp_id=datapunt&response_type=token&client_id=citydata&scope=${encodedScopes}&state=123StateToken&redirect_uri=https%3A%2F%2Fdata.amsterdam.nl%2F`,
      )
      window.location = location
    })
  })

  describe('Logout process', () => {
    it('Removes the access token from the session storage', () => {
      logout()
      expect(global.sessionStorage.clear).toHaveBeenCalled()
    })

    it('Reloads the app', () => {
      const { location } = window
      delete window.location
      window.location = { reload: jest.fn() }
      logout()
      expect(window.location.reload).toHaveBeenCalledWith()
      window.location = location
    })
  })

  describe('Retrieving the return path', () => {
    it('returns the return path after initialized with a successful callback', () => {
      queryObject = {
        access_token: '123AccessToken',
        token_type: 'token',
        expires_in: '36000',
        state: '123StateToken',
      }
      savedStateToken = '123StateToken'
      savedReturnPath = '/path/leading/back'

      initAuth()
      expect(getReturnPath()).toBe(savedReturnPath)
    })

    it('returns an empty string when the callback was unsuccessful', () => {
      initAuth()
      expect(getReturnPath()).toBe('')
    })

    it('returns an empty string when there was an error callback', () => {
      queryObject = {
        error: 'invalid_request',
      }

      expect(() => {
        initAuth()
      }).toThrow()
      expect(getReturnPath()).toBe('')
    })

    it('returns an empty string without any callback', () => {
      expect(getReturnPath()).toBe('')
    })
  })

  describe('Retrieving the auth headers', () => {
    it('Creates an object defining the headers', () => {
      parseAccessToken.mockImplementation(() => ({
        ...notExpiredAccesToken,
      }))
      savedAccessToken = '123AccessToken'
      initAuth()
      const authHeaders = getAuthHeaders()

      expect(authHeaders).toEqual({
        Authorization: 'Bearer 123AccessToken',
      })
    })
  })

  describe('getScopes', () => {
    it('should return a an empty array', () => {
      savedAccessToken = '123AccessToken'
      initAuth()
      const authHeaders = getScopes()

      expect(authHeaders).toEqual([])
    })

    it('should return the scopes', () => {
      parseAccessToken.mockImplementation(() => ({
        ...notExpiredAccesToken,
        scopes: 'scopes!',
      }))

      savedAccessToken = '123AccessToken'
      initAuth()
      const authHeaders = getScopes()

      expect(authHeaders).toEqual('scopes!')
    })
  })

  describe('getName', () => {
    it('should return a an empty string', () => {
      savedAccessToken = '123AccessToken'
      initAuth()
      const authHeaders = getName()

      expect(authHeaders).toEqual('')
    })

    it('should return the scopes', () => {
      parseAccessToken.mockImplementation(() => ({
        ...notExpiredAccesToken,
        name: 'name!',
      }))

      savedAccessToken = '123AccessToken'
      initAuth()
      const authHeaders = getName()

      expect(authHeaders).toEqual('name!')
    })
  })
})
