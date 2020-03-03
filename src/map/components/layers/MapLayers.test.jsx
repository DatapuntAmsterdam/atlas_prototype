import React from 'react'
import { shallow } from 'enzyme'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import MapLayers from './MapLayers'

jest.mock('@datapunt/matomo-tracker-react')

const panelLayers = [
  {
    id: 'id1',
    title: 'foo',
    mapLayers: [
      {
        id: 'id3',
        layers: ['layer'],
        legendItems: [
          {
            title: 'Legend 1',
          },
          {
            title: 'Legend 2',
          },
        ],
        title: 'Foo Layer',
        url: '/maps/layer',
        detailUrl: 'geosearch/search/',
        detailItem: 'foo',
      },
      {
        id: 'id2',
        layers: ['layer'],
        legendItems: [
          {
            title: 'Legend 1',
          },
          {
            title: 'Legend 2',
          },
        ],
        maxZoom: 16,
        minZoom: 8,
        title: 'Foo Layer',
        url: '/maps/layer',
        noDetail: true,
      },
    ],
  },
]

const activeLayers = [panelLayers[0]]

describe('MapLayer', () => {
  const mockTrackEvent = jest.fn()

  beforeEach(() => {
    useMatomo.mockImplementationOnce(() => ({ trackEvent: mockTrackEvent }))
  })

  it('should render', () => {
    const component = shallow(
      <MapLayers
        activeMapLayers={activeLayers}
        panelLayers={panelLayers}
        onLayerToggle={() => {}}
      />,
    )

    expect(component).toMatchSnapshot()
  })

  it('should render without active layers', () => {
    const component = shallow(
      <MapLayers activeMapLayers={[]} panelLayers={panelLayers} onLayerToggle={() => {}} />,
    )

    expect(component).toMatchSnapshot()
  })

  it('should call onLayerToggle when user clicks on button', () => {
    const onLayerToggleMock = jest.fn()

    const component = shallow(
      <MapLayers
        activeMapLayers={activeLayers}
        panelLayers={panelLayers}
        onLayerToggle={onLayerToggleMock}
      />,
    )

    const button = component.find('button').at(0)
    button.simulate('click')

    const firstCollection = panelLayers[0]
    const firstLayer = firstCollection.mapLayers[0]

    expect(onLayerToggleMock).toHaveBeenCalledWith(firstLayer)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'kaartlaag',
      action: firstCollection.title,
      name: firstLayer.title,
    })
  })
})
