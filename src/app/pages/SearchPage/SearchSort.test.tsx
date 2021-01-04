import { cleanup, fireEvent, render } from '@testing-library/react'
import * as ducks from './SearchPageDucks'
import SearchSort from './SearchSort'

jest.mock('./SearchPageDucks')

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => []),
  useDispatch: () => mockDispatch,
}))

const mockTrackEvent = jest.fn()

jest.mock('@datapunt/matomo-tracker-react', () => ({
  useMatomo: () => ({
    trackEvent: mockTrackEvent,
  }),
}))

describe('SearchSort', () => {
  beforeEach(cleanup)

  it('should handle changes in the selection', () => {
    const { getByTestId } = render(
      <SearchSort sort="date:asc" isOverviewPage={false} disabled={false} />,
    )

    const select = getByTestId('sort-select')

    fireEvent.change(select)
    expect(mockTrackEvent).toBeCalled()
    expect(ducks.setSort).toBeCalled()
    expect(ducks.setPage).toBeCalledWith(1) // And reset the page number
  })
})
