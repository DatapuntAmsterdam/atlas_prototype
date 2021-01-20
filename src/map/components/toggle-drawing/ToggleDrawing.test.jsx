import { shallow } from 'enzyme'

import ToggleDrawing, { StyledControlButton } from './ToggleDrawing'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

describe('ToggleDrawing', () => {
  let wrapper

  const setupComponent = (shapeDistanceTxt, drawingEnabled, numberOfMarkers, overrides) => {
    wrapper = shallow(
      <ToggleDrawing
        onCancel={jest.fn}
        onEnd={jest.fn}
        onReset={jest.fn}
        onStart={jest.fn}
        isEnabled={drawingEnabled}
        shapeMarkers={numberOfMarkers}
        shapeDistance={shapeDistanceTxt}
        {...overrides}
      />,
    )
  }

  it('should trigger end drawing action drawing on when clicked', () => {
    const mockFn = jest.fn()
    setupComponent('0,3 m', true, 3, {
      onEnd: mockFn,
    })
    wrapper.find(StyledControlButton).at(0).simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })

  it('should trigger cancel drawing action drawing on when clicked', () => {
    const mockFn = jest.fn()
    setupComponent('0,0 m', true, 0, {
      onCancel: mockFn,
    })
    wrapper.find(StyledControlButton).at(0).simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })

  it('should trigger cancel drawing action drawing on when clicked', () => {
    const mockFn = jest.fn()
    setupComponent('0,3 m', false, 3, {
      onReset: mockFn,
    })
    wrapper.find(StyledControlButton).at(0).simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })

  it('should trigger start drawing action drawing on when clicked', () => {
    const mockFn = jest.fn()
    setupComponent('', false, 0, {
      onStart: mockFn,
    })
    wrapper.find(StyledControlButton).simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })
})
