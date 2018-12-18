import { createSelector } from 'reselect';

export const REDUCER_KEY = 'user';
export const AUTHENTICATE_USER_REQUEST = `${REDUCER_KEY}/AUTHENTICATE_USER_REQUEST`;
export const AUTHENTICATE_USER_SUCCESS = `${REDUCER_KEY}/AUTHENTICATE_USER_SUCCESS`;
export const AUTHENTICATE_USER_FAILED = `${REDUCER_KEY}/AUTHENTICATE_USER_FAILED`;

export const AUTHENTICATE_USER_ERROR = `${REDUCER_KEY}/AUTHENTICATE_USER_ERROR`;

const initialState = {
  authenticated: false,
  accessToken: '',
  scopes: [],
  name: '',
  error: false,
  hasCheckedAuthentication: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATE_USER_SUCCESS: {
      const { accessToken, name, scopes } = action.payload;
      return {
        ...state,
        authenticated: true,
        accessToken,
        name,
        scopes,
        hasCheckedAuthentication: true
      };
    }

    case AUTHENTICATE_USER_FAILED:
      return {
        ...initialState,
        hasCheckedAuthentication: true
      };

    case AUTHENTICATE_USER_ERROR:
      return {
        ...state,
        error: true
      };

    default:
      return state;
  }
}

export const getUser = (state) => state[REDUCER_KEY];
export const userCheckedAuthentication = createSelector(
  getUser, (user) => user.hasCheckedAuthentication
);

export const authenticateUserSuccess = (accessToken, name, scopes) => ({
  type: AUTHENTICATE_USER_SUCCESS,
  payload: { accessToken, name, scopes }
});

export const authenticateRequest = () => ({ type: AUTHENTICATE_USER_REQUEST });
export const authenticateError = () => ({ type: AUTHENTICATE_USER_ERROR });
export const authenticateFailed = () => ({ type: AUTHENTICATE_USER_FAILED });
