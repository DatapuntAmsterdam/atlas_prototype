import L from 'leaflet'
import { shallow } from 'enzyme'
import NonTiledLayer from './NonTiledLayer'

jest.mock('leaflet')

describe('NonTiledLayer', () => {
  let wrapper
  let wrapperInstance
  const props = {
    url: 'https://wms-url',
    rotationAngle: 0,
    layers: ['wms-layer'],
    opacity: 100,
  }

  beforeEach(() => {
    L.nonTiledLayer = {
      wms: jest.fn(),
    }

    wrapper = shallow(<NonTiledLayer {...props} />, {
      context: {
        layerContainer: {
          addLayer: jest.fn(),
          removeLayer: jest.fn(),
        },
      },
    })
    wrapperInstance = wrapper.instance()
  })

  it('should render everything', () => {
    expect(L.nonTiledLayer.wms).toHaveBeenCalledTimes(1)
    expect(L.nonTiledLayer.wms).toHaveBeenCalledWith(props.url, {
      rotationAngle: 0,
      layers: ['wms-layer'],
      opacity: 100,
    })
  })

  it('should update the layers when the property is changed', () => {
    wrapperInstance.leafletElement = {
      _wmsUrl: 'http://old-wms-url',
      wmsParams: { layers: ['old-layer'] },
      setUrl: jest.fn(),
    }

    const fromProps = {
      url: 'http://old-wms-url',
      layers: ['old-layer'],
    }
    const toProps = {
      url: 'http://new-wms-url',
      layers: ['new-layer'],
    }

    wrapperInstance.updateLeafletElement(fromProps, toProps)
    // eslint-disable-next-line no-underscore-dangle
    expect(wrapperInstance.leafletElement._wmsUrl).toEqual(toProps.url)
  })

  it('should hide the layer', () => {
    wrapperInstance.leafletElement = {
      setOpacity: jest.fn(),
    }

    const fromProps = {
      opacity: 100,
    }
    const toProps = {
      opacity: 0,
    }

    wrapperInstance.updateLeafletElement(fromProps, toProps)
    expect(wrapperInstance.leafletElement.setOpacity).toHaveBeenCalledWith(toProps.opacity)
  })
})

function getComponent() {
  return shallow(<NonTiledLayer url="url" params={{ test: '123' }} />, {
    context: {
      layerContainer: {
        addLayer: jest.fn(),
        removeLayer: jest.fn(),
      },
    },
  })
}

describe('NonTiledLayer', () => {
  const props = {
    opacity: 100,
    url: 'https://pano.amsterdam.nl',
    params: {
      mission_type: 'bi',
      mission_year: 2017,
    },
  }

  it('should rerender everything when props change', () => {
    const nonTiledLayer = getComponent()
    const setParamsMock = jest.fn()

    nonTiledLayer.instance().leafletElement = {
      setParams: setParamsMock,
      setOpacity: jest.fn(),
      setUrl: jest.fn(),
      wmsParams: {},
    }

    nonTiledLayer.instance().updateLeafletElement({ props }, { props })
    expect(setParamsMock).not.toHaveBeenCalled()

    nonTiledLayer
      .instance()
      .updateLeafletElement(
        { props },
        { ...props, params: { mission_type: 'WOZ', mission_year: 2018 } },
      )
    expect(setParamsMock).toHaveBeenCalled()
  })
})
