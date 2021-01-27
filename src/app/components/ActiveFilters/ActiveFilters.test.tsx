import { shallow } from 'enzyme'
import { FilterTag } from '@amsterdam/asc-ui'
import ActiveFilters from './ActiveFilters'

describe('ActiveFilters', () => {
  it('should render', () => {
    const component = shallow(
      <ActiveFilters
        filters={[{ label: 'Stadsdeel', slug: 'stadsdeel_naam', option: 'Centrum' }]}
        removeFilter={() => {}}
      />,
    )
    expect(component).toBeDefined()
  })

  it('should handle remove filter', () => {
    const removeFilter = jest.fn()
    const component = shallow(
      <ActiveFilters
        filters={[{ label: 'Stadsdeel', slug: 'stadsdeel_naam', option: 'Centrum' }]}
        removeFilter={removeFilter}
      />,
    )
    component.find(FilterTag).simulate('click')
    expect(removeFilter.mock.calls.length).toBe(1)
    expect(removeFilter.mock.calls[0][0]).toBe('stadsdeel_naam')
  })
})
