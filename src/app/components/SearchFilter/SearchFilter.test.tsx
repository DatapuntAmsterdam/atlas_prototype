import * as React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SearchFilter from './SearchFilter'
import * as ducks from '../../pages/SearchPage/SearchPageDucks'
import { Filter, FilterType, FilterOption } from '../../models'

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
    const { getByLabelText } = render(
      <SearchFilter filter={checkboxFilter} hideCount={false} totalCount={totalCount} />,
    )

    const inputNode = getByLabelText('One (10)')
    expect(inputNode.getAttribute('type')).toBe('checkbox')
  })

  it('should render a list with radio inputs', () => {
    const { getByLabelText } = render(
      <SearchFilter filter={radioFilter} hideCount={false} totalCount={totalCount} />,
    )

    const inputNode = getByLabelText('One (10)')
    expect(inputNode.getAttribute('type')).toBe('radio')
  })

  it('should render a select with the filter options', () => {
    const { getByText } = render(
      <SearchFilter filter={selectFilter} hideCount={false} totalCount={totalCount} />,
    )

    const selectNode = getByText('One (10)')
    expect(selectNode.tagName).toBe('OPTION')
  })

  it('should handle changes in selection', () => {
    const { getByLabelText } = render(
      <SearchFilter filter={checkboxFilter} hideCount={false} totalCount={totalCount} />,
    )

    const inputNodeOne = getByLabelText('One (10)')

    fireEvent.click(inputNodeOne)
    expect(ducks.setFilterValues).toBeCalledWith('group', ['one'])
  })
})
