import { shallow } from 'enzyme'
import Icon from './Icon'

describe('Icon', () => {
  it('should render', () => {
    const component = shallow(<Icon icon="cross" />)
    expect(component).toMatchSnapshot()
  })
})
