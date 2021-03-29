import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@amsterdam/asc-ui'
import { mocked } from 'ts-jest/utils'
import requestLoginLink from '../../../../../api/iiif/requestLoginLink'
import LoginLinkRequestFlow from './LoginLinkRequestFlow'

jest.mock('../../../../../api/iiif/requestLoginLink')

const requestLoginLinkMock = mocked(requestLoginLink)
const MOCK_EMAIL = 'janedoe@example.com'

describe('LoginLinkRequestFlow', () => {
  afterEach(() => {
    requestLoginLinkMock.mockClear()
  })

  it('requests a login link', () => {
    requestLoginLinkMock.mockReturnValue(new Promise(() => {}))

    render(
      <ThemeProvider>
        <LoginLinkRequestFlow email={MOCK_EMAIL} onRetry={() => {}} onClose={() => {}} />
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
        <LoginLinkRequestFlow email={MOCK_EMAIL} onRetry={() => {}} onClose={() => {}} />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('loadingMessage')).toBeDefined()
  })

  it('shows the error message', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.reject(new Error('Whoopsie')))

    render(
      <ThemeProvider>
        <LoginLinkRequestFlow email={MOCK_EMAIL} onRetry={() => {}} onClose={() => {}} />
      </ThemeProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('errorMessage')).toBeDefined())
  })

  it('handles a retry the in the error state', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.reject(new Error('Whoopsie')))

    const onRetry = jest.fn()

    render(
      <ThemeProvider>
        <LoginLinkRequestFlow email={MOCK_EMAIL} onRetry={onRetry} onClose={() => {}} />
      </ThemeProvider>,
    )

    const retryButton = await waitFor(() => screen.getByText('Probeer opnieuw'))

    fireEvent.click(retryButton)
    expect(onRetry).toHaveBeenCalled()
  })

  it('handles closing the modal in the error state', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.reject(new Error('Whoopsie')))

    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginLinkRequestFlow email={MOCK_EMAIL} onRetry={() => {}} onClose={onClose} />
      </ThemeProvider>,
    )

    const closeButton = await waitFor(() => screen.getByText('Annuleren'))

    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('shows the success message', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.resolve())

    render(
      <ThemeProvider>
        <LoginLinkRequestFlow email={MOCK_EMAIL} onRetry={() => {}} onClose={() => {}} />
      </ThemeProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('successMessage')).toBeDefined())
  })

  it('handles closing the modal in the success state', async () => {
    requestLoginLinkMock.mockReturnValue(Promise.resolve())

    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <LoginLinkRequestFlow email={MOCK_EMAIL} onRetry={() => {}} onClose={onClose} />
      </ThemeProvider>,
    )

    const closeButton = await waitFor(() => screen.getByText('Sluiten'))

    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })
})
