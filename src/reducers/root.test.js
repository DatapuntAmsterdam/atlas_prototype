import rootReducer from './root';

import * as AutoSuggestReducer from '../header/ducks/auto-suggest/auto-suggest';
import * as DataSelectionReducer from '../shared/ducks/data-selection/data-selection';
import * as DataSelectionCatalogReducer
  from '../catalog/ducks/data-selection/data-selection-catalog';
import * as ErrorMessageReducer from '../shared/ducks/error-message';
import * as PageReducer from '../shared/ducks/page/page';
import * as UiReducer from '../shared/ducks/ui/ui';
import * as UserReducer from './user';
import * as MapDetailReducer from '../map/ducks/detail/map-detail';
import * as MapReducer from '../map/ducks/map/map';
import * as MapLayersReducer from '../map/ducks/layers/map-layers';
import * as MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers';
import * as MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers';
import * as StraatbeeldReducer from '../shared/ducks/straatbeeld/straatbeeld';
import * as PanoPreviewReducer from '../pano/ducks/preview/pano-preview';
import * as CatalogReducer from '../shared/ducks/catalog/catalog';
import * as deprecatedReducer from './deprecated/deprecated-reducer';

describe('the root reducer', () => {
  const deprecatedOutput = {
    dataSelection: 'dataSelection',
    page: 'page',
    map: 'map',
    mapDetail: 'mapDetail',
    straatbeeld: 'straatbeeld',
    ui: 'ui',
    user: 'user'
  };

  AutoSuggestReducer.default = () => 'autoSuggest';
  DataSelectionReducer.default = () => 'dataSelection';
  DataSelectionCatalogReducer.default = () => 'catalogFilters';
  ErrorMessageReducer.default = () => 'error';
  PageReducer.default = () => 'page';
  UiReducer.default = () => 'ui';
  UserReducer.default = () => 'user';
  MapDetailReducer.default = () => 'mapDetail';
  MapReducer.default = () => 'map';
  MapLayersReducer.default = () => 'layers';
  MapBaseLayersReducer.default = () => 'baseLayers';
  MapPanelLayersReducer.default = () => 'panelLayers';
  StraatbeeldReducer.default = () => 'straatbeeld';
  PanoPreviewReducer.default = () => 'pano';
  CatalogReducer.default = () => 'catalog';
  deprecatedReducer.default = jest.fn().mockReturnValue(() => deprecatedOutput);

  it('combines many reducers', () => {
    const state = {};
    const action = {};

    const output = rootReducer(() => 'location')(state, action);
    expect(output)
      .toEqual({
        ...deprecatedOutput,
        dataSelection: 'dataSelection',
        page: 'page',
        error: 'error',
        map: 'map',
        mapDetail: 'mapDetail',
        pano: 'pano',
        catalog: 'catalog',
        location: 'location',
        straatbeeld: 'straatbeeld',
        ui: 'ui',
        user: 'user',
        currentPage: 'HOME',
        mapLayers: {
          baseLayers: 'baseLayers',
          layers: 'layers',
          panelLayers: 'panelLayers'
        },
        autoSuggest: 'autoSuggest',
        catalogFilters: 'catalogFilters'
      });
  });
});
