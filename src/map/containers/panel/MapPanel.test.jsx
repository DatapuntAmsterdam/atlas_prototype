import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import MapLayers from '../../components/layers/MapLayers';
import MapLegend from '../../components/legend/MapLegend';
import MapType from '../../components/type/MapType';
import MapPanel from './MapPanel';
import MapPanelContainer from './MapPanelContainer';

describe('MapPanel', () => {
  let wrapper;
  const store = configureMockStore()({
    map: {
      baseLayer: '',
      overlays: [{
        isVisible: true
      }]
    },
    mapLayers: {
      layers: {
        items: []
      },
      baseLayers: {
        items: []
      },
      panelLayers: {
        items: []
      }
    },
    overlays: [{}],
    selection: {
      type: 'none'
    },
    ui: { isMapPanelHandleVisible: true, isEmbed: false, isPrintMode: false }
  });

  beforeEach(() => {
    wrapper = shallow(
      <MapPanel
        activeBaseLayer=""
        activeMapLayers={[]}
        isMapPanelHandleVisible
        mapBaseLayers={{}}
        mapLayers={[]}
        overlays={[{}]}
        zoomLevel={10}
        user={{}}
        isPrint={false}
        isMapPanelVisible={false}
        onLayerToggle={jest.fn}
        onBaseLayerToggle={jest.fn}
        onLayerVisibilityToggle={jest.fn}
        onMapPanelHandleToggle={jest.fn}
        onMapPanelToggle={jest.fn}
      />
    );
  });

  it('should render the container', () => {
    expect(shallow(<MapPanelContainer />, { context: { store } })).toMatchSnapshot();
  });

  it('should render MapType and MapLayers', () => {
    expect(wrapper.find(MapType).length).toBe(1);
    expect(wrapper.find(MapLayers).length).toBe(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render MapLegend if store contains active map layers', () => {
    expect(wrapper.find(MapLegend).length).toBe(0);
    wrapper.setProps({ activeMapLayers: [{}], isEachOverlayInvisible: true });
    expect(wrapper.find(MapLegend).length).toBe(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should scroll the map-legend is map panel is visible and have more overlays', () => {
    const scrollIntoViewMock = jest.fn();
    document.querySelector = jest.fn().mockReturnValue({
      scrollIntoView: scrollIntoViewMock
    });
    const scrollElement = document.querySelector;
    wrapper.setProps({
      overlays: [{}, {}],
      isMapPanelVisible: true,
      isEachOverlayInvisible: false
    });
    expect(scrollElement).toHaveBeenCalledTimes(1);
  });
});
