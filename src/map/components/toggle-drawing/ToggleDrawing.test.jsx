import { shallow } from 'enzyme'

import ToggleDrawing from './ToggleDrawing'

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
    wrapper.find('button').at(0).simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })

  it('should trigger cancel drawing action drawing on when clicked', () => {
    const mockFn = jest.fn()
    setupComponent('0,0 m', true, 0, {
      onCancel: mockFn,
    })
    wrapper.find('button').at(0).simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })

  it('should trigger cancel drawing action drawing on when clicked', () => {
    const mockFn = jest.fn()
    setupComponent('0,3 m', false, 3, {
      onReset: mockFn,
    })
    wrapper.find('button').at(0).simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })

  it('should trigger start drawing action drawing on when clicked', () => {
    const mockFn = jest.fn()
    setupComponent('', false, 0, {
      onStart: mockFn,
    })
    wrapper.find('button').at(0).simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })

  it('should render with drawing mode none and no markers', () => {
    setupComponent('', false, 0)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with drawing mode none and 3 markers showing "Opnieuw tekenen"', () => {
    setupComponent('', false, 3)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with drawing mode draw and 3 markers showing "Eindig tekenen"', () => {
    setupComponent('', true, 3)
    expect(wrapper).toMatchSnapshot()
  })
})
