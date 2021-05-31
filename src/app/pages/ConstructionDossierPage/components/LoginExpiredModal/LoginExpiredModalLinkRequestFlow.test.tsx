import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@amsterdam/asc-ui'
import { mocked } from 'ts-jest/utils'
import requestLoginLink from '../../../../../api/iiif/requestLoginLink'
import LoginExpiredModalLinkRequestFlow from './LoginExpiredModalLinkRequestFlow'

jest.mock('../../../../../api/iiif/requestLoginLink')

const requestLoginLinkMock = mocked(requestLoginLink)
const MOCK_EMAIL = 'janedoe@example.com'

describe('LoginExpiredModalLinkRequestFlow', () => {
  afterEach(() => {
    requestLoginLinkMock.mockClear()
  })

  it('requests a login link', () => {
    requestLoginLinkMock.mockReturnValue(new Promise(() => {}))

    render(
      <ThemeProvider>
        <LoginExpiredModalLinkRequestFlow
          email={MOCK_EMAIL}
          onRetry={() => {}}
          onClose={() => {}}
        />
      </ThemeProvider>,
    )

    expect(requestLoginLinkMock).toHaveBeenCalledWith({
      email: MOCK_EMAIL,
      originUrl: 'http://localhost:3000/',
    })
  })

  it('shows the loading message', () => {
    requestLoginLinkMock.mockReturnValue(new Promise(() => {}))

    render(
      <ThemeProvider>
        <LoginExpiredModalLinkRequestFlow
          email={MOCK_EMAIL}
          onRetry={() => {}}
          onClose={() => {}}
        />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('loadingMessage')).toBeInTheDocument()
  })

  it('shows the error message', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.reject(new Error('Oops')))

    render(
      <ThemeProvider>
        <LoginExpiredModalLinkRequestFlow
          email={MOCK_EMAIL}
          onRetry={() => {}}
          onClose={() => {}}
        />
      </ThemeProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('errorMessage')).toBeInTheDocument())
  })

  it('handles a retry in the error state', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.reject(new Error('Oops')))

    const onRetry = jest.fn()

    render(
      <ThemeProvider>
        <LoginExpiredModalLinkRequestFlow email={MOCK_EMAIL} onRetry={onRetry} onClose={() => {}} />
      </ThemeProvider>,
    )

    const retryButton = await waitFor(() => screen.findByText('Probeer opnieuw'))

    fireEvent.click(retryButton)
    expect(onRetry).toHaveBeenCalled()
  })

  it('handles closing the modal in the error state', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.reject(new Error('Oops')))

    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginExpiredModalLinkRequestFlow email={MOCK_EMAIL} onRetry={() => {}} onClose={onClose} />
      </ThemeProvider>,
    )

    const closeButton = await waitFor(() => screen.findByText('Annuleren'))

    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('shows the success message', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.resolve())

    render(
      <ThemeProvider>
        <LoginExpiredModalLinkRequestFlow
          email={MOCK_EMAIL}
          onRetry={() => {}}
          onClose={() => {}}
        />
      </ThemeProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('successMessage')).toBeInTheDocument())
  })

  it('handles closing the modal in the success state', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.resolve())

    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginExpiredModalLinkRequestFlow email={MOCK_EMAIL} onRetry={() => {}} onClose={onClose} />
      </ThemeProvider>,
    )

    const closeButton = await waitFor(() => screen.findByText('Sluiten'))

    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })
})
