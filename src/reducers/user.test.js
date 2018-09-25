import reducer, {
  authenticateError,
  authenticateUser
} from './user';

const initialState = {
  authenticated: false,
  accessToken: '',
  name: '',
  scopes: [],
  error: false
};

describe('User Reducer', () => {
  it('should load the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should set the user data when AUTHENTICATE_USER is dispatched', () => {
    expect(reducer(initialState, authenticateUser('token', 'name', ['scope']))).toEqual({
      authenticated: true,
      accessToken: 'token',
      name: 'name',
      scopes: ['scope'],
      error: false
    });
  });

  it('should set error details when AUTHENTICATE_ERROR is dispatched', () => {
    expect(reducer(initialState, authenticateError())).toEqual({
      ...initialState,
      error: true
    });
  });
});
