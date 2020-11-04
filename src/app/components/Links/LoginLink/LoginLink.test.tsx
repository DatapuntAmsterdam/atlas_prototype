import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import { login } from '../../../../shared/services/auth/auth'
import LoginLink from './LoginLink'

jest.mock('../../../../shared/services/auth/auth')
jest.mock('../../../utils/useDocumentTitle', () => () => ({
  documentTitle: 'Some title',
}))

const mockTrackEvent = jest.fn()

jest.mock('@datapunt/matomo-tracker-react', () => ({
  useMatomo: () => ({
    trackEvent: mockTrackEvent,
  }),
}))

const mockedLogin = mocked(login, true)

describe('LoginLink', () => {
  it('should trigger the login when clicked', () => {
    const { getByTestId } = render(<LoginLink />)

    fireEvent.click(getByTestId('link'))

    expect(mockedLogin).toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalled()
  })
})
