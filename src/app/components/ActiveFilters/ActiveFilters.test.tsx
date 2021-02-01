import { render, screen, fireEvent } from '@testing-library/react'
import ActiveFilters from './ActiveFilters'
import withAppContext from '../../utils/withAppContext'

const filters = [
  { slug: 'eigenaar_cat', label: 'Zakelijk gerechtigde', option: 'Staat' },
  { slug: 'buurt_naam', label: 'Buurt', option: 'Afrikahaven' },
]

describe('ActiveFilters', () => {
  it('should not render anything', () => {
    render(withAppContext(<ActiveFilters filters={[]} removeFilter={() => {}} />))

    expect(screen.queryByTestId('activeFilters')).not.toBeInTheDocument()
  })

  it('should render list with items', () => {
    render(withAppContext(<ActiveFilters filters={filters} removeFilter={() => {}} />))

    expect(screen.getByTestId('activeFilters')).toBeInTheDocument()

    expect(screen.getAllByTestId('activeFiltersItem')).toHaveLength(filters.length)
  })

  it('should handle remove filter', () => {
    const removeFilter = jest.fn()
    render(withAppContext(<ActiveFilters filters={filters} removeFilter={removeFilter} />))

    expect(removeFilter).not.toHaveBeenCalled()

    const buttonIndex = 0

    fireEvent.click(screen.getAllByTestId('activeFiltersItem')[buttonIndex])

    expect(removeFilter).toHaveBeenCalledWith(filters[buttonIndex].slug)
  })
})
