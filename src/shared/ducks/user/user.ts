import { createSelector } from 'reselect'

export const REDUCER_KEY = 'user'
export const AUTHENTICATE_USER_REQUEST = 'user/AUTHENTICATE_USER_REQUEST'
export const AUTHENTICATE_USER_RELOAD = 'user/AUTHENTICATE_USER_RELOAD'
export const AUTHENTICATE_USER_SUCCESS = 'user/AUTHENTICATE_USER_SUCCESS'
export const AUTHENTICATE_USER_FAILED = 'user/AUTHENTICATE_USER_FAILED'
export const AUTHENTICATE_USER_ERROR = 'user/AUTHENTICATE_USER_ERROR'

export interface UserState {
  authenticated: boolean
  accessToken: string
  scopes: string[]
  name: string
  error: boolean
  hasCheckedAuthentication: boolean
}

type RequestName = 'inloggen' | 'uitloggen'

export interface AuthenticateUserRequestAction {
  type: typeof AUTHENTICATE_USER_REQUEST
  meta: {
    tracking: RequestName
  }
}

export interface AuthenticateUserReloadAction {
  type: typeof AUTHENTICATE_USER_RELOAD
}

export interface AuthenticateUserSuccessAction {
  type: typeof AUTHENTICATE_USER_SUCCESS
  payload: {
    accessToken: string
    name: string
    scopes: string[]
    tracking?: string[]
  }
}

export interface AuthenticateUserFailedAction {
  type: typeof AUTHENTICATE_USER_FAILED
}

export interface AuthenticateUserErrorAction {
  type: typeof AUTHENTICATE_USER_ERROR
}

export type UserAction =
  | AuthenticateUserRequestAction
  | AuthenticateUserReloadAction
  | AuthenticateUserSuccessAction
  | AuthenticateUserFailedAction
  | AuthenticateUserErrorAction

const initialState: UserState = {
  authenticated: false,
  accessToken: '',
  scopes: [],
  name: '',
  error: false,
  hasCheckedAuthentication: false,
}

export default function userReducer(state = initialState, action: UserAction): UserState {
  switch (action.type) {
    case AUTHENTICATE_USER_SUCCESS: {
      const { accessToken, name, scopes } = action.payload
      return {
        ...state,
        authenticated: true,
        accessToken,
        name,
        scopes,
        hasCheckedAuthentication: true,
      }
    }

    case AUTHENTICATE_USER_FAILED:
      return {
        ...initialState,
        hasCheckedAuthentication: true,
      }

    case AUTHENTICATE_USER_ERROR:
      return {
        ...state,
        error: true,
      }

    default:
      return state
  }
}

/**
 * Get the user state from the store.
 *
 * @param state The root state of the store.
 */
// TODO: Replace 'any' type with 'RootState' type once store is fully typed.
export const getUser = (state: any): UserState => state[REDUCER_KEY]

/**
 * Check if the user has attempted to authenticate, possibly resulting in either a successful or unsuccessfully authenticated state.
 *
 * @param state The root state of the store.
 */
export const userCheckedAuthentication = createSelector(
  getUser,
  (user) => user.hasCheckedAuthentication,
)

/**
 * Check if the user is authenticated.
 *
 * @param state The root state of the store.
 */
export const userIsAuthenticated = createSelector(getUser, (user) => user.authenticated)

/**
 * Get the user's access token from the store.
 *
 * @param state The root state of the store.
 */
export const getUserToken = createSelector(getUser, (user) => user.accessToken)

/**
 * Get the user's authenticated scopes from the store. This determines which parts of the application the user can use and which API calls are allowed.
 *
 * @param state The root state of the store.
 */
export const getUserScopes = createSelector(getUser, (user) => user.scopes)

export const authenticateRequest = (requestName: RequestName): AuthenticateUserRequestAction => ({
  type: AUTHENTICATE_USER_REQUEST,
  meta: {
    tracking: requestName,
  },
})

export const authenticateReload = (): AuthenticateUserReloadAction => ({
  type: AUTHENTICATE_USER_RELOAD,
})

export const authenticateUserSuccess = (
  accessToken: string,
  name: string,
  scopes: string[],
  reload: boolean,
): AuthenticateUserSuccessAction => {
  const meta = !reload ? { tracking: scopes } : null

  return {
    type: AUTHENTICATE_USER_SUCCESS,
    payload: { accessToken, name, scopes },
    ...meta,
  }
}

export const authenticateFailed = (): AuthenticateUserFailedAction => ({
  type: AUTHENTICATE_USER_FAILED,
})

export const authenticateError = (): AuthenticateUserErrorAction => ({
  type: AUTHENTICATE_USER_ERROR,
})
