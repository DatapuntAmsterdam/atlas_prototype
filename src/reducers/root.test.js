import * as MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers'
import * as MapDetailReducer from '../map/ducks/detail/reducer'
import * as MapLayersReducer from '../map/ducks/layers/map-layers'
import * as MapReducer from '../map/ducks/map/reducer'
import * as MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers'
import * as PanoramaReducer from '../panorama/ducks/reducer'
import * as DataSearchReducer from '../shared/ducks/data-search/reducer'
import * as DataSelectionReducer from '../shared/ducks/data-selection/reducer'
import * as DetailReducer from '../shared/ducks/detail/reducer'
import * as ErrorMessageReducer from '../shared/ducks/error/error-message'
import * as FiltersReducer from '../shared/ducks/filters/filters'
import * as SelectionReducer from '../shared/ducks/selection/selection'
import * as UiReducer from '../shared/ducks/ui/ui'
import * as UserReducer from '../shared/ducks/user/user'
import rootReducer from './root'

describe('the root reducer', () => {
  DataSelectionReducer.default = () => 'dataSelection'
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
  DataSearchReducer.default = () => 'dataSearch'
  SelectionReducer.default = () => 'selection'
  FiltersReducer.default = () => 'filter'

  it('combines many reducers', () => {
    const state = {}
    const action = {}

    const output = rootReducer(() => 'location')(state, action)
    expect(output).toMatchSnapshot()
  })
})
