import { shallow } from 'enzyme'
import CustomMarker from './CustomMarker'

describe('CustomMarker', () => {
  it('should render everything', () => {
    const wrapper = shallow(<CustomMarker position={[]} zIndexOffset={100} rotationAngle={0} />, {
      context: {
        layerContainer: {
          addLayer: jest.fn(),
          removeLayer: jest.fn(),
        },
      },
    })
    const setRotationAngleMock = jest.fn()

    wrapper.instance().leafletElement = {
      setRotationAngle: setRotationAngleMock,
    }
    wrapper.instance().updateLeafletElement({ rotationAngle: 0 }, { rotationAngle: 1 })

    expect(wrapper).toMatchSnapshot()

    wrapper.instance().updateLeafletElement({ rotationAngle: 1 }, { rotationAngle: 1 })
    expect(setRotationAngleMock).toHaveBeenCalledTimes(1)
  })
})
