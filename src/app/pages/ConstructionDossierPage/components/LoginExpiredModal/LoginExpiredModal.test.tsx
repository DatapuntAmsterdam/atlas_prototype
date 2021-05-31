import { Modal, ThemeProvider } from '@amsterdam/asc-ui'
import { fireEvent, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { mocked } from 'ts-jest/utils'
import LoginExpiredModalLinkRequestFlow from './LoginExpiredModalLinkRequestFlow'
import LoginExpiredModal from './LoginExpiredModal'

jest.mock('@amsterdam/asc-ui', () => {
  const originalModule = jest.requireActual('@amsterdam/asc-ui')

  return {
    __esModule: true,
    ...originalModule,
    Modal: jest.fn(),
  }
})

jest.mock('./LoginExpiredModalLinkRequestFlow')

const LoginExpiredModalLinkRequestFlowMock = mocked(LoginExpiredModalLinkRequestFlow)
const ModalMock = mocked(Modal)
const MOCK_EMAIL = 'janedoe@example.com'

describe('LoginExpiredModal', () => {
  beforeEach(() => {
    ModalMock.mockImplementation(({ children, ...otherProps }) => (
      <div {...otherProps}>{children}</div>
    ))

    LoginExpiredModalLinkRequestFlowMock.mockImplementation(() => <div />)
  })

  afterEach(() => {
    ModalMock.mockClear()
    LoginExpiredModalLinkRequestFlowMock.mockClear()
  })

  it('renders the modal', () => {
    render(
      <ThemeProvider>
        <LoginExpiredModal onClose={() => {}} />
      </ThemeProvider>,
    )
  })

  it('closes when requested by the modal', () => {
    ModalMock.mockImplementation(({ children, onClose, ...otherProps }) => {
      useEffect(() => {
        onClose?.()
      }, [])

      return <div {...otherProps}>{children}</div>
    })

    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginExpiredModal onClose={onClose} />
      </ThemeProvider>,
    )

    expect(onClose).toHaveBeenCalled()
  })

  it('closes when pressing the close button', () => {
    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginExpiredModal onClose={onClose} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByTitle('Sluit'))

    expect(onClose).toHaveBeenCalled()
  })

  it('closes when pressing the cancel button', () => {
    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginExpiredModal onClose={onClose} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByText('Annuleren'))

    expect(onClose).toHaveBeenCalled()
  })

  it('shows the request flow when submitting the form', () => {
    render(
      <ThemeProvider>
        <LoginExpiredModal onClose={() => {}} />
      </ThemeProvider>,
    )

    fireEvent.change(screen.getByLabelText('E-mailadres'), { target: { value: MOCK_EMAIL } })
    fireEvent.click(screen.getByText('Versturen'))

    expect(LoginExpiredModalLinkRequestFlowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: MOCK_EMAIL,
      }),
      {},
    )
  })

  it('hides the request flow when retrying', () => {
    LoginExpiredModalLinkRequestFlowMock.mockImplementation(({ onRetry }) => {
      useEffect(() => {
        onRetry()
      }, [])

      return <div data-testid="requestFlow" />
    })

    render(
      <ThemeProvider>
        <LoginExpiredModal onClose={() => {}} />
      </ThemeProvider>,
    )

    fireEvent.change(screen.getByLabelText('E-mailadres'), { target: { value: MOCK_EMAIL } })
    fireEvent.click(screen.getByText('Versturen'))

    expect(screen.queryByTestId('requestFlow')).not.toBeInTheDocument()
  })

  it('closes when requested by the request flow', () => {
    LoginExpiredModalLinkRequestFlowMock.mockImplementation(({ onClose }) => {
      useEffect(() => {
        onClose()
      }, [])

      return <div />
    })

    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginExpiredModal onClose={onClose} />
      </ThemeProvider>,
    )

    fireEvent.change(screen.getByLabelText('E-mailadres'), { target: { value: MOCK_EMAIL } })
    fireEvent.click(screen.getByText('Versturen'))

    expect(onClose).toHaveBeenCalled()
  })
})
