import { expectSaga, testSaga } from 'redux-saga-test-plan'
import {
  authenticateFailed,
  authenticateRequest,
  authenticateUserSuccess,
  AUTHENTICATE_USER_RELOAD,
  AUTHENTICATE_USER_REQUEST,
} from '../../ducks/user/user'
import * as auth from '../../services/auth/auth'
import watchAuthenticationRequest, { authenticateUser, waitForAuthentication } from './user'

jest.mock('../../services/auth/auth')

describe('watchAuthenticationRequest', () => {
  const action = { type: AUTHENTICATE_USER_REQUEST }

  it('should watch "AUTHENTICATE_USER_REQUEST" and call authenticateUser', () => {
    testSaga(watchAuthenticationRequest)
      .next()
      .takeLatestEffect([AUTHENTICATE_USER_REQUEST], authenticateUser)
      .next(action)
      .takeLatestEffect([AUTHENTICATE_USER_RELOAD], authenticateUser)
      .next(action)
      .isDone()
  })
})

describe('authenticateUser', () => {
  it('should dispatch succes when the user is authorized ', () => {
    auth.getAccessToken.mockImplementation(() => 'token')
    auth.getName.mockImplementation(() => 'name')
    auth.getScopes.mockImplementation(() => ['scope'])
    expectSaga(authenticateUser, authenticateRequest('inloggen'))
      .put(authenticateUserSuccess('token', 'name', ['scope']))
      .run()
  })

  it('should dispatch succes when the user is authorized ', () => {
    auth.getAccessToken.mockImplementation(() => null)
    expectSaga(authenticateUser, authenticateRequest('inloggen')).put(authenticateFailed()).run()
  })
})

describe('waitForAuthentication', () => {
  it('should return when authentication was done', () => {
    testSaga(waitForAuthentication)
      .next()
      .next(true) // userCheckedAuthentication
      .isDone()
  })

  it('should wait for the race events when the authentication was not checked', () => {
    testSaga(waitForAuthentication)
      .next()
      .next(false) // userCheckedAuthentication
      .next(authenticateFailed)
      .isDone()
  })
})
