import { all, fork } from 'redux-saga/effects'
import watchAuthenticationRequest from './shared/sagas/user/user'

export default function* rootSaga() {
  yield all([fork(watchAuthenticationRequest)])
}
