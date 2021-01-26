import { shallow, ShallowWrapper } from 'enzyme'
import ToggleDrawing, { ToggleDrawingProps, StyledControlButton } from './ToggleDrawing'

jest.mock('react-redux', () => ({
  // @ts-ignore
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

describe('ToggleDrawing', () => {
  let wrapper: ShallowWrapper<any, any, any>

  const setupComponent = (
    shapeDistanceTxt: string,
    drawingEnabled: boolean,
    numberOfMarkers: number,
    overrides: Partial<ToggleDrawingProps>,
  ) => {
    const mockFn = () => ({ type: 'someaction' })
    wrapper = shallow(
      <ToggleDrawing
        onCancel={mockFn}
        onEnd={mockFn}
        onReset={mockFn}
        onStart={mockFn}
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
