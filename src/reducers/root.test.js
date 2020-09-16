import rootReducer from './root'

import * as DataSelectionReducer from '../shared/ducks/data-selection/reducer'
import * as Datasets from '../shared/ducks/datasets/datasets'
import * as DataSelectionCatalogReducer from '../shared/ducks/datasets/apiSpecification/apiSpecification'
import * as ErrorMessageReducer from '../shared/ducks/error/error-message'
import * as UiReducer from '../shared/ducks/ui/ui'
import * as UserReducer from '../shared/ducks/user/user'
import * as MapDetailReducer from '../map/ducks/detail/reducer'
import * as MapReducer from '../map/ducks/map/reducer'
import * as MapLayersReducer from '../map/ducks/layers/map-layers'
import * as MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers'
import * as MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers'
import * as PanoramaReducer from '../panorama/ducks/reducer'
import * as PanoPreviewReducer from '../panorama/ducks/preview/panorama-preview'
import * as FiltersReducer from '../shared/ducks/filters/filters'
import * as DataSearchReducer from '../shared/ducks/data-search/reducer'
import * as SelectionReducer from '../shared/ducks/selection/selection'
import * as DetailReducer from '../shared/ducks/detail/reducer'

describe('the root reducer', () => {
  DataSelectionReducer.default = () => 'dataSelection'
  DataSelectionCatalogReducer.default = () => 'catalogFilters'
  ErrorMessageReducer.default = () => 'error'
  UiReducer.default = () => 'ui'
  UserReducer.default = () => 'user'
  DetailReducer.default = () => 'detail'
  MapDetailReducer.default = () => 'mapDetail'
  MapReducer.default = () => 'map'
  MapLayersReducer.default = () => 'layers'
  MapBaseLayersReducer.default = () => 'baseLayers'
  MapPanelLayersReducer.default = () => 'panelLayers'
  PanoramaReducer.default = () => 'panorama'
  PanoPreviewReducer.default = () => 'panoramaPreview'
  DataSearchReducer.default = () => 'dataSearch'
  SelectionReducer.default = () => 'selection'
  FiltersReducer.default = () => 'filter'
  Datasets.default = () => 'datasets'

  it('combines many reducers', () => {
    const state = {}
    const action = {}

    const output = rootReducer(() => 'location')(state, action)
    expect(output).toMatchSnapshot()
  })
})
