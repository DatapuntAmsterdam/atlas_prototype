import { put, race, select, take, takeLatest } from 'redux-saga/effects';
import {
  AUTHENTICATE_USER_FAILED,
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS,
  authenticateFailed,
  authenticateUserSuccess,
  userCheckedAuthentication
} from '../../ducks/user/user';
import * as auth from '../../services/auth/auth';

function* authenticateUser() {
  const accessToken = auth.getAccessToken();
  if (accessToken) {
    yield put(authenticateUserSuccess(auth.getAccessToken(), auth.getName(), auth.getScopes()));
  } else {
    yield put(authenticateFailed());
  }
}

export function* waitForAuthentication() {
  const didAuthCheck = yield select(userCheckedAuthentication);
  if (!didAuthCheck) {
    yield race([
      take(AUTHENTICATE_USER_SUCCESS),
      take(AUTHENTICATE_USER_FAILED)
    ]);
  }
}

export default function* watchAuthenticationRequest() {
  yield takeLatest([AUTHENTICATE_USER_REQUEST], authenticateUser);
}
