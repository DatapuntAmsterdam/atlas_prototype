import { shallow } from 'enzyme'
import ToggleFullscreen, { StyledControlButton } from './ToggleFullscreen'

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
      wrapper.find(StyledControlButton).at(0).simulate('click')
      expect(onToggleFullscreen).toHaveBeenCalled()
    })

    it('should trigger toggle on when clicked', () => {
      const wrapper = shallow(<ToggleFullscreen {...props} />)
      wrapper.find(StyledControlButton).at(0).simulate('click')
      expect(onToggleFullscreen).toHaveBeenCalled()
    })
  })
})
