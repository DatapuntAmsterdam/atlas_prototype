import { put, race, select, take, takeLatest } from 'redux-saga/effects'
import {
  authenticateFailed,
  AuthenticateUserReloadAction,
  AuthenticateUserRequestAction,
  authenticateUserSuccess,
  AUTHENTICATE_USER_FAILED,
  AUTHENTICATE_USER_RELOAD,
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS,
  userCheckedAuthentication,
} from '../../ducks/user/user'
import * as auth from '../../services/auth/auth'

export function* authenticateUser(
  action: AuthenticateUserRequestAction | AuthenticateUserReloadAction,
) {
  const accessToken = auth.getAccessToken()
  const reload = action.type === AUTHENTICATE_USER_RELOAD

  if (accessToken) {
    yield put(authenticateUserSuccess(accessToken, auth.getName(), auth.getScopes(), reload))
  } else {
    yield put(authenticateFailed())
  }
}

export function* waitForAuthentication() {
  const didAuthCheck = yield select(userCheckedAuthentication)

  if (!didAuthCheck) {
    yield race({
      success: take(AUTHENTICATE_USER_SUCCESS),
      failed: take(AUTHENTICATE_USER_FAILED),
    })
  }
}

export default function* watchAuthenticationRequest() {
  yield takeLatest([AUTHENTICATE_USER_REQUEST], authenticateUser)
  yield takeLatest([AUTHENTICATE_USER_RELOAD], authenticateUser)
}
