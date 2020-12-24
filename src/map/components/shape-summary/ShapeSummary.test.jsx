import { shallow } from 'enzyme'

import ShapeSummary from './ShapeSummary'

describe('ShapeSummary', () => {
  let onClearDrawing
  beforeEach(() => {
    onClearDrawing = jest.fn()
  })

  it('should trigger toggle drawing on when clicked with zero markers', () => {
    const wrapper = shallow(
      <ShapeSummary shapeDistanceTxt="23,45 km" onClearDrawing={onClearDrawing} />,
    )
    wrapper.find('button').at(0).simulate('click')
    expect(onClearDrawing).toHaveBeenCalled()
  })

  it('should render info with 2 markers', () => {
    const wrapper = shallow(
      <ShapeSummary shapeMarkers={2} shapeDistanceTxt="23,45 km" onClearDrawing={onClearDrawing} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
