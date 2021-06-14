import { render, screen } from '@testing-library/react'
import Rating from './Rating'

describe('Rating', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })
  it('should set the right amount of filled and empty stars', () => {
    const { rerender } = render(<Rating defaultValue={3} />)
    expect(screen.getAllByTestId('filledStar').length).toBe(3)
    expect(screen.getAllByTestId('emptyStar').length).toBe(2)

    rerender(<Rating defaultValue={0} />)
    expect(screen.queryAllByTestId('filledStar').length).toBe(0)
    expect(screen.getAllByTestId('emptyStar').length).toBe(5)
  })

  it('should set the max of available starts', () => {
    render(<Rating defaultValue={3} max={10} />)
    expect(screen.getAllByTestId('filledStar').length).toBe(3)
    expect(screen.getAllByTestId('emptyStar').length).toBe(7)
  })

  it('should show a console warning if max is < 1', () => {
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(<Rating defaultValue={0} max={0} />)
    expect(consoleWarnMock).toHaveBeenCalledWith(
      '"max" prop for Rating component should be bigger than 0',
    )
  })

  it('should show a console warning if defaultValue exceeds the value of max', () => {
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(<Rating defaultValue={4} max={2} />)
    expect(consoleWarnMock).toHaveBeenCalledWith(
      '"defaultValue" prop for Rating component exceeds the given max',
    )
  })
})
