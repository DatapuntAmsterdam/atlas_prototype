import { fireEvent, render, screen } from '@testing-library/react'
import ToggleFullscreen from './ToggleFullscreen'

describe('ToggleFullscreen', () => {
  const onToggleFullscreen = jest.fn()
  const props = {
    title: 'ABC',
    onToggleFullscreen,
  }

  it('triggers maximization', () => {
    render(<ToggleFullscreen {...props} isFullscreen={false} />)

    fireEvent.click(screen.getByLabelText('vergroten', { exact: false }))

    expect(onToggleFullscreen).toHaveBeenCalled()
  })

  it('triggers minimization', () => {
    render(<ToggleFullscreen {...props} isFullscreen />)

    fireEvent.click(screen.getByLabelText('verkleinen', { exact: false }))

    expect(onToggleFullscreen).toHaveBeenCalled()
  })
})
