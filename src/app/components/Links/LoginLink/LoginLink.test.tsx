import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { mocked } from 'ts-jest/utils'
import { authenticateRequest } from '../../../../shared/ducks/user/user'
import { login } from '../../../../shared/services/auth/auth'
import LoginLink from './LoginLink'

jest.mock('../../../../shared/services/auth/auth')

const mockStore = configureMockStore()
const mockedLogin = mocked(login, true)

describe('LoginLink', () => {
  it('should trigger the login when clicked', () => {
    const store = mockStore({})
    const { getByTestId } = render(
      <Provider store={store}>
        <LoginLink />
      </Provider>,
    )

    fireEvent.click(getByTestId('link'))

    expect(store.getActions()).toEqual([authenticateRequest('inloggen')])
    expect(mockedLogin).toHaveBeenCalled()
  })
})
