import { shallow } from 'enzyme'

import PointsAvailable from './PointsAvailable'

describe('PointsAvailable', () => {
  it('should render no markers left', () => {
    const wrapper = shallow(<PointsAvailable markersLeft={0} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render one marker left', () => {
    const wrapper = shallow(<PointsAvailable markersLeft={1} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render multiple markers left', () => {
    const wrapper = shallow(<PointsAvailable markersLeft={2} />)
    expect(wrapper).toMatchSnapshot()
  })
})
