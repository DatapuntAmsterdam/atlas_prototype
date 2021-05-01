import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import IFrame from './IFrame'

describe('IFrame', () => {
  const src = 'https://this.is/a-link/this-is-a-slug'
  const title = 'title'

  it('mounts the iframe ', () => {
    render(<IFrame src={src} title={title} />)
    expect(screen.getByTitle(title)).toBeInTheDocument()
  })

  it('shows a loading spinner', () => {
    render(<IFrame src={src} title={title} />)
    expect(screen.getByTestId('loadingSpinner')).toBeInTheDocument()
  })

  it('hides the loading spinner when the iframe loads', () => {
    render(<IFrame src={src} title={title} />)
    fireEvent.load(screen.getByTitle(title))
    expect(screen.queryByTestId('loadingSpinner')).not.toBeInTheDocument()
  })

  it('sets the height based on events from the iframe', async () => {
    render(<IFrame src={src} title={title} />)
    window.postMessage('documentHeight:300', '*')
    await waitFor(() => expect(screen.getByTitle(title)).toHaveAttribute('height', '300'))
  })

  it('ignores events from the iframe that are not in the correct format', async () => {
    render(<IFrame src={src} title={title} />)

    window.postMessage('someotherevent', '*')
    window.postMessage(1337, '*')

    // No expects here, we're just waiting for no errors to occur.
    await new Promise((resolve) => setTimeout(resolve, 100))
  })

  it('stops listening to events when unmounted', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = render(<IFrame src={src} title={title} />)
    const callParams = addEventListenerSpy.mock.calls.find(([type]) => type === 'message')

    expect(callParams).toBeDefined()

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(...callParams)
  })
})
