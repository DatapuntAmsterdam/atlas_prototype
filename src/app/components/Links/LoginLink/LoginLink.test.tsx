import { screen, fireEvent, render } from '@testing-library/react'
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
    render(<LoginLink />)

    fireEvent.click(screen.getByTestId('link'))

    expect(mockedLogin).toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalled()
  })
})
