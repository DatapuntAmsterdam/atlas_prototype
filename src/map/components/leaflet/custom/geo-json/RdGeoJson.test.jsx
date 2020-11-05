import React from 'react'
import { shallow } from 'enzyme'
import leafletModule from 'leaflet'
import RdGeoJson from './RdGeoJson'
import '../../../../services/crs-service'

leafletModule.Proj.geoJson = jest.fn()

function shallowRenderComponent() {
  return shallow(
    <RdGeoJson
      data={{
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [121354.82, 487493.672],
                [121355.332, 487498.93],
                [121349.41, 487499.506],
                [121348.903, 487494.304],
                [121354.82, 487493.672],
              ],
            ],
          ],
        },
        label: 'ASD04 F 04358 G 0000',
      }}
      key="https://acc.api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11450435870000/"
      ref={jest.fn()}
    />,
    {
      context: {
        layerContainer: {
          addLayer: jest.fn(),
          removeLayer: jest.fn(),
        },
      },
      disableLifecycleMethods: true,
    },
  )
}

describe('RdGeoJson component', () => {
  it('should call super.componentWillUnmount', () => {
    const component = shallowRenderComponent()
    component.instance().componentWillUnmount()
    expect(component.instance().layerContainer.removeLayer).toHaveBeenCalled()
  })
})
