import { fireEvent, render, screen } from '@testing-library/react'
import ShareBar from './ShareBar'

jest.mock('../../../shared/ducks/ui/ui')

describe('ShareBar', () => {
  beforeEach(() => {
    global.window.open = jest.fn()
  })

  it('should handle onClick event on buttons', () => {
    render(<ShareBar hideInPrintMode={false} />)

    const buttons = screen.queryAllByRole('button')

    buttons.forEach((button) => {
      fireEvent.click(button)
    })

    expect(buttons.length).toBe(5)
  })
})
