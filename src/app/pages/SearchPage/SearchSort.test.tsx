import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import SearchSort from './SearchSort'
import { SortOrder } from './query-params'
import withAppContext from '../../utils/withAppContext'

const mockTrackEvent = jest.fn()

jest.mock('@datapunt/matomo-tracker-react', () => ({
  useMatomo: () => ({
    trackEvent: mockTrackEvent,
  }),
}))

describe('SearchSort', () => {
  beforeEach(cleanup)

  it('should handle changes in the selection', () => {
    render(
      withAppContext(
        <SearchSort
          sort={{ field: 'date', order: SortOrder.Ascending }}
          isOverviewPage={false}
          disabled={false}
        />,
      ),
    )

    const select = screen.getByTestId('sort-select')

    fireEvent.change(select)
    expect(mockTrackEvent).toBeCalled()
  })
})
