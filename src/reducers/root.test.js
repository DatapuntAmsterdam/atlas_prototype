import rootReducer from './root';

import * as AutoSuggestReducer from '../header/ducks/auto-suggest/auto-suggest';
import * as DataSelectionReducer from '../shared/ducks/data-selection/reducer';
import * as Datasets from '../shared/ducks/datasets/datasets';
import * as DataSelectionCatalogReducer
  from '../shared/ducks/datasets/apiSpecification/apiSpecification';
import * as ErrorMessageReducer from '../shared/ducks/error-message';
import * as PageReducer from '../shared/ducks/page/page';
import * as UiReducer from '../shared/ducks/ui/ui';
import * as UserReducer from '../shared/ducks/user/user';
import * as MapDetailReducer from '../map/ducks/detail/map-detail';
import * as MapReducer from '../map/ducks/map/map';
import * as MapLayersReducer from '../map/ducks/layers/map-layers';
import * as MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers';
import * as MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers';
import * as PanoramaReducer from '../panorama/ducks/reducer';
import * as PanoPreviewReducer from '../panorama/ducks/preview/panorama-preview';
import * as FiltersReducer from '../shared/ducks/filters/filters';
import * as DataSearchReducer from '../shared/ducks/data-search/reducer';
import * as SelectionReducer from '../shared/ducks/selection/selection';
import * as DetailReducer from '../shared/ducks/detail/reducer';

describe('the root reducer', () => {
  AutoSuggestReducer.default = () => 'autoSuggest';
  DataSelectionReducer.default = () => 'dataSelection';
  DataSelectionCatalogReducer.default = () => 'catalogFilters';
  ErrorMessageReducer.default = () => 'error';
  PageReducer.default = () => 'page';
  UiReducer.default = () => 'ui';
  UserReducer.default = () => 'user';
  DetailReducer.default = () => 'detail';
  MapDetailReducer.default = () => 'mapDetail';
  MapReducer.default = () => 'map';
  MapLayersReducer.default = () => 'layers';
  MapBaseLayersReducer.default = () => 'baseLayers';
  MapPanelLayersReducer.default = () => 'panelLayers';
  PanoramaReducer.default = () => 'panorama';
  PanoPreviewReducer.default = () => 'panoramaPreview';
  DataSearchReducer.default = () => 'dataSearch';
  SelectionReducer.default = () => 'selection';
  FiltersReducer.default = () => 'filters';
  Datasets.default = () => 'datasets';

  it('combines many reducers', () => {
    const state = {};
    const action = {};

    const output = rootReducer(() => 'location')(state, action);
    expect(output)
      .toEqual({
        dataSelection: 'dataSelection',
        datasets: 'datasets',
        page: 'page',
        error: 'error',
        filters: 'filters',
        map: 'map',
        detail: 'detail',
        mapDetail: 'mapDetail',
        location: 'location',
        panoramaPreview: 'panoramaPreview',
        panorama: 'panorama',
        ui: 'ui',
        user: 'user',
        dataSearch: 'dataSearch',
        selection: 'selection',
        mapLayers: {
          baseLayers: 'baseLayers',
          layers: 'layers',
          panelLayers: 'panelLayers'
        },
        autoSuggest: 'autoSuggest'
      });
  });
});
