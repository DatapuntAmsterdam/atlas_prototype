import { screen, cleanup, fireEvent, render } from '@testing-library/react'
import * as reactRedux from 'react-redux'
import type { Filter, FilterOption } from '../../models/filter'
import { FilterType } from '../../models/filter'
import * as ducks from '../../pages/SearchPage/SearchPageDucks'
import SearchFilter, { getFilterComponent } from './SearchFilter'

const mockTrackEvent = jest.fn()

jest.mock('@datapunt/matomo-tracker-react', () => ({
  useMatomo: () => ({
    trackEvent: mockTrackEvent,
  }),
}))

jest.mock('../../pages/SearchPage/SearchPageDucks')

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => []),
  useDispatch: () => mockDispatch,
}))

const groupOptions: FilterOption[] = [
  {
    id: 'one',
    label: 'One',
    count: 10,
  },
  {
    id: 'two',
    label: 'Two',
    count: 5,
  },
  {
    id: 'three',
    label: 'Three',
    count: 15,
  },
]

const totalCount = groupOptions.reduce((count, option) => count + option.count, 0)

const checkboxFilter: Filter = {
  type: 'group',
  filterType: FilterType.Checkbox,
  label: 'Groep',
  options: groupOptions,
}

const radioFilter: Filter = {
  type: 'group',
  filterType: FilterType.Radio,
  label: 'Group',
  options: groupOptions,
}

const selectFilter: Filter = {
  type: 'group',
  filterType: FilterType.Select,
  label: 'Group',
  options: groupOptions,
}

describe('SearchFilter', () => {
  beforeEach(cleanup)

  it('should render a list with checkbox inputs', () => {
    render(<SearchFilter filter={checkboxFilter} hideCount={false} totalCount={totalCount} />)

    const inputNode = screen.getByLabelText('One (10)')
    expect(inputNode).toHaveAttribute('type', 'checkbox')
  })

  it('should render a list with radio inputs', () => {
    render(<SearchFilter filter={radioFilter} hideCount={false} totalCount={totalCount} />)

    const inputNode = screen.getByLabelText('One (10)')
    expect(inputNode).toHaveAttribute('type', 'radio')
  })

  it('should render a select with the filter options', () => {
    render(<SearchFilter filter={selectFilter} hideCount={false} totalCount={totalCount} />)

    const selectNode = screen.getByText('One (10)')
    expect(selectNode.tagName).toBe('OPTION')
  })

  it('should handle changes in selection for checkboxes', () => {
    render(<SearchFilter filter={checkboxFilter} hideCount={false} totalCount={totalCount} />)

    const inputNodeOne = screen.getByLabelText('One (10)')

    fireEvent.click(inputNodeOne)
    expect(ducks.setFilterValues).toBeCalledWith('group', ['one'])
    expect(ducks.setPage).toBeCalledWith(1) // And reset the page number
  })

  it('should handle changes in selection for radio buttons', () => {
    render(<SearchFilter filter={radioFilter} hideCount={false} totalCount={totalCount} />)

    const inputNodeOne = screen.getByLabelText('One (10)')

    fireEvent.click(inputNodeOne)
    expect(ducks.setFilterValues).toBeCalledWith('group', ['one'])
    expect(ducks.setPage).toBeCalledWith(1) // And reset the page number
  })

  it('should handle changes in selection for a select', () => {
    render(<SearchFilter filter={selectFilter} hideCount={false} totalCount={totalCount} />)

    const inputNodeOne = screen.getByText('One (10)')

    fireEvent.click(inputNodeOne)
    expect(ducks.setFilterValues).toBeCalledWith('group', ['one'])
    expect(ducks.setPage).toBeCalledWith(1) // And reset the page number
  })

  describe('getFilterComponent', () => {
    it('should get a component for all possible types', () => {
      Object.values(FilterType).forEach((type) => {
        expect(getFilterComponent(type)).toBeDefined()
      })
    })
  })

  describe('Matomo tracking', () => {
    it('should track changes added to selection using Matomo', () => {
      render(<SearchFilter filter={checkboxFilter} hideCount={false} totalCount={totalCount} />)

      const inputNodeOne = screen.getByLabelText('One (10)')

      fireEvent.click(inputNodeOne)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        category: 'search',
        action: 'enable-filter',
        name: 'group-one',
      })
    })

    it('should track changes removed from selection using Matomo', () => {
      const useSelectorSpy = jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => ['one'])
      render(<SearchFilter filter={checkboxFilter} hideCount={false} totalCount={totalCount} />)

      const inputNodeOne = screen.getByLabelText('One (10)')

      fireEvent.click(inputNodeOne)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        category: 'search',
        action: 'disable-filter',
        name: 'group-one',
      })

      useSelectorSpy.mockClear()
    })
  })
})
