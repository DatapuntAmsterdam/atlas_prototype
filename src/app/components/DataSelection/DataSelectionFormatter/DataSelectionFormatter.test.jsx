import { shallow } from 'enzyme'
import DataSelectionFormatter from './DataSelectionFormatter'
import * as filters from '../../Filters/Filters'

jest.mock('../../Filters/Filters')

// Todo: DP-6235
describe('DataSelectionFormatter', () => {
  beforeEach(() => {
    filters.zipCodeFilter.mockReturnValue('1234 AB')
  })
  it('should render without failing', () => {
    const component = shallow(
      <DataSelectionFormatter variables={[{ value: '1234DAB' }]} formatter="zipcode" />,
    )

    expect(component).toMatchSnapshot()
  })
})
