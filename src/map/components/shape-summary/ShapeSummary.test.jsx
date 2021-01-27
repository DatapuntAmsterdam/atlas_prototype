import { shallow } from 'enzyme'
import { Button } from '@amsterdam/asc-ui'

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
    wrapper.find(Button).at(0).simulate('click')
    expect(onClearDrawing).toHaveBeenCalled()
  })
})
