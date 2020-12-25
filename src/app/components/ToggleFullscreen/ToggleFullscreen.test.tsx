import { shallow } from 'enzyme'
import ToggleFullscreen from './ToggleFullscreen'

describe('ToggleFullscreen', () => {
  const onToggleFullscreen = jest.fn()
  const props = {
    isFullscreen: true,
    title: 'ABC',
    onToggleFullscreen,
  }

  describe('actions', () => {
    it('should trigger toggle off when clicked', () => {
      const wrapper = shallow(<ToggleFullscreen {...props} />)
      wrapper.find('IconButton').at(0).simulate('click')
      expect(onToggleFullscreen).toHaveBeenCalled()
    })

    it('should trigger toggle on when clicked', () => {
      const wrapper = shallow(<ToggleFullscreen {...props} />)
      wrapper.find('IconButton').at(0).simulate('click')
      expect(onToggleFullscreen).toHaveBeenCalled()
    })

    describe('rendering', () => {
      it('should render with fullscreen is turned on', () => {
        const wrapper = shallow(<ToggleFullscreen {...props} />)
        expect(wrapper).toMatchSnapshot()
      })

      it('should render with fullscreen is turned off', () => {
        const wrapper = shallow(<ToggleFullscreen {...props} />)
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
