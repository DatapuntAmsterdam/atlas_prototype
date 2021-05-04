import { Modal, ThemeProvider } from '@amsterdam/asc-ui'
import { fireEvent, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { mocked } from 'ts-jest/utils'
import LoginLinkRequestFlow from './LoginLinkRequestFlow'
import LoginLinkRequestModal from './LoginLinkRequestModal'

jest.mock('@amsterdam/asc-ui', () => {
  const originalModule = jest.requireActual('@amsterdam/asc-ui')

  return {
    __esModule: true,
    ...originalModule,
    Modal: jest.fn(),
  }
})

jest.mock('./LoginLinkRequestFlow')

const LoginLinkRequestFlowMock = mocked(LoginLinkRequestFlow)
const ModalMock = mocked(Modal)
const MOCK_EMAIL = 'janedoe@example.com'

describe('LoginLinkRequestModal', () => {
  beforeEach(() => {
    ModalMock.mockImplementation(({ children, ...otherProps }) => (
      <div {...otherProps}>{children}</div>
    ))

    LoginLinkRequestFlowMock.mockImplementation(() => <div />)
  })

  afterEach(() => {
    ModalMock.mockClear()
    LoginLinkRequestFlowMock.mockClear()
  })

  it('renders the modal', () => {
    render(
      <ThemeProvider>
        <LoginLinkRequestModal onClose={() => {}} />
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
        <LoginLinkRequestModal onClose={onClose} />
      </ThemeProvider>,
    )

    expect(onClose).toHaveBeenCalled()
  })

  it('closes when pressing the close button', () => {
    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginLinkRequestModal onClose={onClose} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByTitle('Sluit'))

    expect(onClose).toHaveBeenCalled()
  })

  it('closes when pressing the cancel button', () => {
    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginLinkRequestModal onClose={onClose} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByText('Annuleren'))

    expect(onClose).toHaveBeenCalled()
  })

  it('shows the request flow when submitting the form', () => {
    render(
      <ThemeProvider>
        <LoginLinkRequestModal onClose={() => {}} />
      </ThemeProvider>,
    )

    fireEvent.change(screen.getByLabelText('E-mailadres'), { target: { value: MOCK_EMAIL } })
    fireEvent.click(screen.getByText('Versturen'))

    expect(LoginLinkRequestFlowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: MOCK_EMAIL,
      }),
      {},
    )
  })

  it('hides the request flow when retrying', () => {
    LoginLinkRequestFlowMock.mockImplementation(({ onRetry }) => {
      useEffect(() => {
        onRetry()
      }, [])

      return <div data-testid="requestFlow" />
    })

    render(
      <ThemeProvider>
        <LoginLinkRequestModal onClose={() => {}} />
      </ThemeProvider>,
    )

    fireEvent.change(screen.getByLabelText('E-mailadres'), { target: { value: MOCK_EMAIL } })
    fireEvent.click(screen.getByText('Versturen'))

    expect(screen.queryByTestId('requestFlow')).not.toBeInTheDocument()
  })

  it('closes when requested by the request flow', () => {
    LoginLinkRequestFlowMock.mockImplementation(({ onClose }) => {
      useEffect(() => {
        onClose()
      }, [])

      return <div />
    })

    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginLinkRequestModal onClose={onClose} />
      </ThemeProvider>,
    )

    fireEvent.change(screen.getByLabelText('E-mailadres'), { target: { value: MOCK_EMAIL } })
    fireEvent.click(screen.getByText('Versturen'))

    expect(onClose).toHaveBeenCalled()
  })
})
