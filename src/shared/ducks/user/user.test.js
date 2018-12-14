import reducer, {
  AUTHENTICATE_USER_ERROR,
  AUTHENTICATE_USER_FAILED,
  AUTHENTICATE_USER_SUCCESS,
  authenticateError,
  authenticateFailed,
  authenticateUserSuccess
} from './user';

const initialState = {
  authenticated: false,
  accessToken: '',
  name: '',
  scopes: [],
  error: false,
  hasCheckedAuthentication: false
};

describe('User Reducer', () => {
  it('should load the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it(`should set the user data when ${AUTHENTICATE_USER_SUCCESS} is dispatched`, () => {
    expect(reducer(
      initialState,
      authenticateUserSuccess('token', 'name', ['scope'])
    )).toEqual({
      authenticated: true,
      accessToken: 'token',
      name: 'name',
      scopes: ['scope'],
      error: false,
      hasCheckedAuthentication: true
    });
  });

  it(`should set error details when ${AUTHENTICATE_USER_ERROR} is dispatched`, () => {
    expect(reducer(initialState, authenticateError())).toEqual({
      ...initialState,
      error: true
    });
  });

  it(`should set error details when ${AUTHENTICATE_USER_FAILED} is dispatched`, () => {
    expect(reducer(initialState, authenticateFailed())).toEqual({
      ...initialState,
      hasCheckedAuthentication: true
    });
  });
});
