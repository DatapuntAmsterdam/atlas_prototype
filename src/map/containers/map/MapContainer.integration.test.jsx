import React from 'react';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { mount } from 'enzyme';
import createSagaMiddleware from 'redux-saga';

import MapContainer from './MapContainer';

import rootSaga from '../../../root-saga';

import BaseLayerReducer from '../../ducks/base-layers/map-base-layers';
import MapDetailReducer from '../../ducks/detail/reducer';
import MapLayersReducer from '../../ducks/layers/map-layers';
import MapReducer from '../../ducks/map/reducer';
import PanelLayersReducer from '../../ducks/panel-layers/map-panel-layers';
import reducer from '../../../shared/ducks/data-search/reducer';

import UiReducer from '../../../shared/ducks/ui/ui';
import UserReducer from '../../../shared/ducks/user/user';

const mapLayersReducer = combineReducers({
  layers: MapLayersReducer,
  baseLayers: BaseLayerReducer,
  panelLayers: PanelLayersReducer
});

const mainReducer = combineReducers({
  mapDetail: MapDetailReducer,
  resultsMap: reducer,
  user: UserReducer,
  ui: UiReducer,
  map: MapReducer,
  mapLayers: mapLayersReducer
});

let store;
let enhancer;
let mapContainer;
let leafletContainer;
let mapLeafletComponent;
let panelContainer;
let mapLayersComponent;
let mapType;

const nextTick = (timeOutAmount) => (
  new Promise((resolve) => {
    process.nextTick(() => {
      if (timeOutAmount > 0) {
        return setTimeout(() => {
          resolve();
        }, timeOutAmount);
      }
      return resolve();
    });
  })
);

const updateContainer = async (container) => {
  container.update();
  leafletContainer = container.find('LeafletContainer');
  mapLeafletComponent = leafletContainer.find('MapLeaflet');
  panelContainer = container.find('MapPanelContainer');
  mapLayersComponent = panelContainer.find('MapLayers');
  mapType = panelContainer.find('MapType');
};

describe('MapContainer', () => {
  beforeEach(async () => {
    // create real store with saga. The code does not seem to update a mock-store correctly
    const sagaMiddleware = createSagaMiddleware();
    enhancer = compose(
      applyMiddleware(sagaMiddleware)
    );
    store = createStore(mainReducer, {}, enhancer);
    // Only run the saga which is in scope for this test
    sagaMiddleware.run(rootSaga);
    mapContainer = mount(<MapContainer />, { context: { store } });
    await nextTick(100);
    updateContainer(mapContainer);
    // TODO: fix error that htmlcanvas doesn't work in test
    HTMLCanvasElement.prototype.getContext = () => '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all the components in MapContainer', () => {
    expect(mapContainer).toMatchSnapshot();
  });

  describe('Map Layers', () => {
    it('should not contain layers by default', async () => {
      expect(mapLeafletComponent.prop('layers')).toEqual([]);
    });

    it('should add a the correct layers to the MapLeaflet component on legenda item click', async () => {
      mapLayersComponent.find('button').first().simulate('click');
      updateContainer(mapContainer);
      expect(mapLeafletComponent.prop('layers')).toMatchSnapshot();
    });

    it('should remove the correct layers if legenda item is clicked again', async () => {
      mapLayersComponent.find('button').first().simulate('click');
      updateContainer(mapContainer);
      mapLayersComponent.find('button').first().simulate('click');
      updateContainer(mapContainer);
      expect(mapLeafletComponent.prop('layers')).toEqual([]);
    });
  });

  describe('Map Base Layers', () => {
    it('should have the urlTemplate of the first baseLayer in the state', async () => {
      expect(mapLeafletComponent.prop('baseLayer').urlTemplate).toEqual(
        store.getState().mapLayers.baseLayers.items[0].urlTemplate
      );
    });

    it('should switch from baseLayer if clicked on a different baseLayer dropdown item', async () => {
      const urlTemplateBeforeClick = mapLeafletComponent.prop('baseLayer').urlTemplate;
      const selectButton = mapType.find('.select-button__drop-down-button').at(3);
      selectButton.simulate('click');
      updateContainer(mapContainer);
      expect(mapLeafletComponent.prop('baseLayer').urlTemplate).not.toBe(urlTemplateBeforeClick);
      expect(mapLeafletComponent.prop('baseLayer')).toMatchSnapshot();
    });
  });
});
