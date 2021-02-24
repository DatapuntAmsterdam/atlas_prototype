import { render } from '@testing-library/react'
import BrowserSupportAlert from './BrowserSupportAlert'
import withAppContext from '../../utils/withAppContext'

describe('BrowserSupportAlert', () => {
  const userAgentSpy = jest.spyOn(navigator, 'userAgent', 'get')

  afterEach(() => {
    userAgentSpy.mockReset()
  })

  it('renders a message for unsupported browsers', () => {
    userAgentSpy.mockReturnValue(
      'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0',
    )

    const { container } = render(withAppContext(<BrowserSupportAlert />))

    expect(container.firstChild).not.toBeNull()
  })

  it('renders no message for supported browsers', () => {
    userAgentSpy.mockReturnValue(
      'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0',
    )

    const { container } = render(withAppContext(<BrowserSupportAlert />))

    expect(container.firstChild).toBeNull()
  })
})
