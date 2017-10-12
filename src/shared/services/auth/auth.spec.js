jest.mock('../query-string-parser/query-string-parser');
jest.mock('../state-token-generator/state-token-generator');

import { initAuth, login, logout, getReturnPath, getAuthHeaders } from './auth';
import queryStringParser from '../query-string-parser/query-string-parser';
import stateTokenGenerator from '../state-token-generator/state-token-generator';

describe('The auth service', () => {
  let origSessionStorage, origLocation, origHeaders;
  let queryObject, stateToken;
  let savedStateToken, savedReturnPath, savedAccessToken;

  beforeEach(() => {
    origSessionStorage = global.sessionStorage;
    global.sessionStorage = {};
    global.sessionStorage.getItem = jest.fn();
    global.sessionStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'accessToken':
          return savedAccessToken;
        case 'stateToken':
          return savedStateToken;
        case 'returnPath':
          return savedReturnPath;
        default:
          return;
      }
    });
    global.sessionStorage.setItem = jest.fn();
    global.sessionStorage.removeItem = jest.fn();

    origLocation = global.location;
    global.location = {};
    global.location.reload = jest.fn();

    origHeaders = global.Headers;
    global.Headers = jest.fn();

    queryStringParser.mockImplementation(() => queryObject);
    stateTokenGenerator.mockImplementation(() => stateToken);

    queryObject = {};
    stateToken = '123StateToken';
    savedStateToken = '';
    savedReturnPath = '';
    savedAccessToken = '';
  });

  afterEach(() => {
    global.sessionStorage = origSessionStorage;
    global.location = origLocation;
    global.Headers = origHeaders;
  });

  describe('init funtion', () => {
    describe('receiving response errors from the auth service', () => {
      it('throws an error', () => {
        const queryString = '?error=invalid_request&error_description=invalid%20request';
        global.location.search = queryString;
        queryObject = {
          error: 'invalid_request',
          error_description: 'invalid request'
        };

        expect(() => {
          initAuth();
        }).toThrow('Authorization service responded with error invalid_request [invalid request] ' +
            '(The request is missing a required parameter, includes an invalid parameter value, ' +
            'includes a parameter more than once, or is otherwise malformed.)');
        expect(queryStringParser).toHaveBeenCalledWith(queryString);
      });

      it('throws an error without a description in the query string', () => {
        global.location.search = '';
        queryObject = {
          error: 'invalid_request'
        };

        expect(() => {
          initAuth();
        }).toThrow();
      });

      it('removes the state token from the session storage', () => {
        global.location.search = '';
        queryObject = {
          error: 'invalid_request'
        };

        expect(() => {
          initAuth();
        }).toThrow();
        expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('stateToken');
      });

      it('does not handle any errors without an error in the query string', () => {
        global.location.search = '';
        queryObject = {};

        expect(() => {
          initAuth();
        }).not.toThrow();
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith('stateToken');
      });

      it('does not handle any errors without a query string', () => {
        global.location.search = '';
        queryObject = undefined;

        expect(() => {
          initAuth();
        }).not.toThrow();
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith('stateToken');
      });
    });

    describe('receiving a successful callback from the auth service', () => {
      it('throws an error when the state token received does not match the one saved', () => {
        const queryString = '?access_token=123AccessToken&token_type=token&expires_in=36000&state=invalidStateToken';
        global.location.hash = queryString;
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: 'invalidStateToken'
        };
        savedStateToken = '123StateToken';

        expect(() => {
          initAuth();
        }).toThrow('Authenticator encountered an invalid state token (invalidStateToken)')
        expect(queryStringParser).toHaveBeenCalledWith(queryString);
      });

      it('Updates the session storage', () => {
        const queryString = '?access_token=123AccessToken&token_type=token&expires_in=36000&state=123StateToken';
        global.location.hash = queryString;
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: '123StateToken'
        };
        savedStateToken = '123StateToken';
        savedReturnPath = '/path/leading/back';

        initAuth();
        expect(global.sessionStorage.setItem).toHaveBeenCalledWith('accessToken', '123AccessToken');
        expect(global.sessionStorage.getItem).toHaveBeenCalledWith('returnPath');
        expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('returnPath');
        expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('stateToken');
      });

      it('Works when receiving unexpected parameters', () => {
        const queryString = '?access_token=123AccessToken&token_type=token&expires_in=36000&state=123StateToken&extra=sauce';
        global.location.hash = queryString;
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: '123StateToken',
          extra: 'sauce'
        };
        savedStateToken = '123StateToken';
        savedReturnPath = '/path/leading/back';

        initAuth();
        expect(global.sessionStorage.setItem).toHaveBeenCalledWith('accessToken', '123AccessToken');
      });

      it('Does not work when a parameter is missing', () => {
        const queryString = '?access_token=123AccessToken&token_type=token&state=123StateToken';
        global.location.hash = queryString;
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          state: '123StateToken'
        };
        savedStateToken = '123StateToken';

        initAuth();
        expect(global.sessionStorage.setItem).not.toHaveBeenCalledWith('accessToken', '123AccessToken');
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith('returnPath');
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith('stateToken');
      });
    });

    describe('The login process', () => {
      it('Starts when there is no access token', () => {
        initAuth();
        expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('accessToken');
      });

      it('Does not start when there is an access token', () => {
        savedStateToken = '123StateToken';
        savedReturnPath = '/path/leading/back';
        savedAccessToken = '123AccessToken';

        initAuth();
        expect(global.sessionStorage.removeItem).not.toHaveBeenCalledWith('accessToken');
      });
    });
  });

  describe('Login process', () => {
    it('throws an error when the crypto library is not supported by the browser', () => {
      stateToken = '';
      expect(() => {
        login();
      }).toThrow('crypto library is not available on the current browser');
    });

    it('Updates the session storage', () => {
      const pathname = '/the/current/path';
      global.location.pathname = pathname;

      login();

      expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith('returnPath', pathname);
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith('stateToken', stateToken);
    });

    it('Redirects to the auth service', () => {
      const pathname = '/the/current/path';
      global.location.pathname = pathname;
      global.location.protocol = 'https:';
      global.location.host = 'data.amsterdam.nl';

      login();

      expect(global.location.href).toBe('https://acc.api.data.amsterdam.nl/' +
        'oauth2/authorize?idp_id=datapunt&response_type=token&client_id=authz_admin&scope=AUR%2FR%20AUR%2FW' +
        '&state=123StateToken&redirect_uri=https%3A%2F%2Fdata.amsterdam.nl%2F');
    });
  });

  describe('Logout process', () => {
    it('Removes the access token from the session storage', () => {
      logout();
      expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('accessToken');
    });

    it('Reloads the app', () => {
      logout();
      expect(global.location.reload).toHaveBeenCalledWith();
    });
  });

  describe('Retrieving the return path', () => {
    it('returns the return path after initialized with a successful callback', () => {
      queryObject = {
        access_token: '123AccessToken',
        token_type: 'token',
        expires_in: '36000',
        state: '123StateToken'
      };
      savedStateToken = '123StateToken';
      savedReturnPath = '/path/leading/back';

      initAuth();
      expect(getReturnPath()).toBe(savedReturnPath);
    });

    it('returns an empty string when the callback was unsuccessful', () => {
      initAuth();
      expect(getReturnPath()).toBe('');
    });

    it('returns an empty string when there was an error callback', () => {
      queryObject = {
        error: 'invalid_request'
      };

      expect(() => {
        initAuth();
      }).toThrow();
      expect(getReturnPath()).toBe('');
    });

    it('returns an empty string without any callback', () => {
      expect(getReturnPath()).toBe('');
    });
  });

  describe('Retrieving the auth headers', () => {
    it('Creates a new instance of the Headers class with the right headers set', () => {
      savedAccessToken = '123AccessToken';
      initAuth();
      const authHeaders = getAuthHeaders();

      expect(authHeaders instanceof global.Headers).toBe(true);
      expect(global.Headers).toHaveBeenCalledWith({
        Authorization: 'Bearer 123AccessToken'
      });
    });
  });
});
