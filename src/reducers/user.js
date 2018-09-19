export const AUTHENTICATE_USER = 'AUTHENTICATE_USER';
const AUTHENTICATE_ERROR = 'AUTHENTICATE_ERROR';

const initialState = {
  authenticated: false,
  accessToken: '',
  scopes: [],
  name: '',
  error: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATE_USER:
      return {
        ...state,
        authenticated: true,
        accessToken: action.accessToken,
        name: action.name,
        scopes: action.scopes
      };

    case AUTHENTICATE_ERROR:
      return {
        ...state,
        error: true
      };

    default:
      return state;
  }
}

export const authenticateUser = (accessToken, name, scopes) =>
  ({ type: AUTHENTICATE_USER, accessToken, name, scopes });

export const authenticateError = () => ({ type: AUTHENTICATE_ERROR });
