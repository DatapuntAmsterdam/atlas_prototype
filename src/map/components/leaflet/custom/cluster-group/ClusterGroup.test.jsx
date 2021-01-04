import { shallow } from 'enzyme'

import ClusterGroup from './ClusterGroup'

describe('ClusterGroup', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should render everything', () => {
    const getMarkerGroupBoundsMock = jest.fn()

    jest.runAllTimers()

    const wrapper = shallow(
      <ClusterGroup markers={[]} getMarkerGroupBounds={getMarkerGroupBoundsMock} />,
      {
        context: {
          layerContainer: {
            addLayer: jest.fn(),
            removeLayer: jest.fn(),
          },
        },
      },
    )

    expect(wrapper).toMatchSnapshot()
    wrapper.instance().tryToGetBounds = jest.fn()

    expect(setTimeout).toHaveBeenCalledTimes(1)
    jest.runOnlyPendingTimers()
    expect(wrapper.instance().tryToGetBounds).toHaveBeenCalled()
  })

  it('should call getMarkerGroupBounds prop when bounds are defined', () => {
    const getMarkerGroupBoundsMock = jest.fn()

    jest.runAllTimers()

    const wrapper = shallow(
      <ClusterGroup markers={[]} getMarkerGroupBounds={getMarkerGroupBoundsMock} />,
      {
        context: {
          layerContainer: {
            addLayer: jest.fn(),
            removeLayer: jest.fn(),
          },
        },
      },
    )

    wrapper.instance().leafletElement = {
      getBounds: jest.fn().mockReturnValue({
        foo: 'foo',
        bar: 'bar',
      }),
    }

    wrapper.instance().tryToGetBounds()
    expect(setTimeout).toHaveBeenCalledTimes(2)
    jest.runOnlyPendingTimers()
    expect(getMarkerGroupBoundsMock).toHaveBeenCalled()
  })
})
