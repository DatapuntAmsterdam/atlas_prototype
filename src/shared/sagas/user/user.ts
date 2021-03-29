import { call, put, race, select, take, takeLatest } from 'redux-saga/effects'
import { isFeatureEnabled, FEATURE_KEYCLOAK_AUTH } from '../../../app/features'
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
import { initKeycloak } from '../../services/auth/auth-keycloak'

const useKeycloak = isFeatureEnabled(FEATURE_KEYCLOAK_AUTH)

export function* authenticateUser(
  action: AuthenticateUserRequestAction | AuthenticateUserReloadAction,
) {
  const reload = action.type === AUTHENTICATE_USER_RELOAD
  // We can't await promises in sagas, so let's hack this shit for now.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-ignore
  const authenticated = useKeycloak && reload ? yield call(initKeycloak) : false
  const accessToken = auth.getAccessToken()

  if (accessToken) {
    yield put(authenticateUserSuccess(accessToken, auth.getName(), auth.getScopes(), reload))
  } else {
    yield put(authenticateFailed())
  }
}

export function* waitForAuthentication() {
  const didAuthCheck = (yield select(userCheckedAuthentication)) as boolean

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
