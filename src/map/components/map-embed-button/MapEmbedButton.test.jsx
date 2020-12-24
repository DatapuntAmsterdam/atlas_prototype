import configureMockStore from 'redux-mock-store'
import { shallow } from 'enzyme'

import MapEmbedButton from './MapEmbedButton'

jest.useFakeTimers()
jest.mock('../../../shared/services/embed-url/embed-url')

describe('MapEmbedButton', () => {
  it('should render the component', () => {
    const wrapper = shallow(<MapEmbedButton store={configureMockStore()({})} />).dive()
    expect(wrapper).toMatchSnapshot()
  })

  it('should open the embed window when clicked', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    }
    const wrapper = shallow(<MapEmbedButton store={configureMockStore()({})} />).dive()
    wrapper.find('button').simulate('click', mockEvent)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300)
  })
})
