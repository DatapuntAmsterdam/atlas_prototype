import { screen, cleanup, fireEvent, render } from '@testing-library/react'
import ShowMore from './ShowMore'

describe('ShowMore', () => {
  beforeEach(cleanup)

  it('should render no button if the items can be contained within the limit', () => {
    render(
      <ShowMore limit={20}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </ShowMore>,
    )

    expect(screen.queryByTestId('showMoreButton')).not.toBeInTheDocument()
  })

  it('should render a button if the items cannot be contained within the limit', () => {
    render(
      <ShowMore limit={2}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </ShowMore>,
    )

    expect(screen.getByTestId('showMoreButton')).toBeInTheDocument()
  })

  it('should hide the items if they cannot be contained within the limit', () => {
    render(
      <ShowMore limit={2}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span data-testid="extraItem">Item 3</span>
      </ShowMore>,
    )

    expect(screen.queryByTestId('extraItem')).not.toBeInTheDocument()
  })

  it('should show and hide items when the button is pressed', () => {
    render(
      <ShowMore limit={2}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span data-testid="extraItem">Item 3</span>
      </ShowMore>,
    )

    fireEvent.click(screen.getByTestId('showMoreButton'))
    expect(screen.getByTestId('extraItem')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('showMoreButton'))
    expect(screen.queryByTestId('extraItem')).not.toBeInTheDocument()
  })
})
