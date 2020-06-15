import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import ShowMore from './ShowMore'

describe('ShowMore', () => {
  beforeEach(cleanup)

  it('should render no button if the items can be contained within the limit', () => {
    const { queryByTestId } = render(
      <ShowMore limit={20}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </ShowMore>,
    )

    expect(queryByTestId('showMoreButton')).toBeNull()
  })

  it('should render a button if the items cannot be contained within the limit', () => {
    const { getByTestId } = render(
      <ShowMore limit={2}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </ShowMore>,
    )

    expect(getByTestId('showMoreButton')).toBeDefined()
  })

  it('should hide the items if they cannot be contained within the limit', () => {
    const { queryByTestId } = render(
      <ShowMore limit={2}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span data-testid="extraItem">Item 3</span>
      </ShowMore>,
    )

    expect(queryByTestId('extraItem')).toBeNull()
  })

  it('should show and hide items when the button is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <ShowMore limit={2}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span data-testid="extraItem">Item 3</span>
      </ShowMore>,
    )

    fireEvent.click(getByTestId('showMoreButton'))
    expect(getByTestId('extraItem')).toBeDefined()
    fireEvent.click(getByTestId('showMoreButton'))
    expect(queryByTestId('extraItem')).toBeNull()
  })
})
