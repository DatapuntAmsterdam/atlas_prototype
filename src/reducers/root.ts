import { combineReducers } from 'redux'
import SearchPageReducer, { REDUCER_KEY as SEARCH } from '../app/pages/SearchPage/SearchPageDucks'
import MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers'
import MapDetailReducer from '../map/ducks/detail/reducer'
import MapLayersReducer from '../map/ducks/layers/map-layers'
import { REDUCER_KEY as MAP } from '../map/ducks/map/constants'
import MapReducer from '../map/ducks/map/reducer'
import MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers'
import PanoPreviewReducer, {
  REDUCER_KEY as PANO_PREVIEW,
} from '../panorama/ducks/preview/panorama-preview'
import PanoramaReducer, { PANORAMA } from '../panorama/ducks/reducer'
import DataSearchReducer, { DATA_SEARCH_REDUCER } from '../shared/ducks/data-search/reducer'
import DataSelectionReducer, { DATA_SELECTION } from '../shared/ducks/data-selection/reducer'
import DatasetReducer, { DATASETS } from '../shared/ducks/datasets/datasets'
import DetailReducer, { DETAIL } from '../shared/ducks/detail/reducer'
import ErrorMessageReducer, { REDUCER_KEY as ERROR } from '../shared/ducks/error/error-message'
import FilesReducer, { FILES_REDUCER } from '../shared/ducks/files/reducer'
import FiltersReducer, { REDUCER_KEY as FILTER } from '../shared/ducks/filters/filters'
import SelectionReducer, { REDUCER_KEY as SELECTION } from '../shared/ducks/selection/selection'
import UiReducer, { UI } from '../shared/ducks/ui/ui'
import UserReducer, { REDUCER_KEY as USER } from '../shared/ducks/user/user'
import { LOCATION } from '../store/redux-first-router/constants'

const rootReducer = (routeReducer: any) => (oldState: any = {}, action: any) => {
  const mapLayers = combineReducers({
    layers: MapLayersReducer,
    baseLayers: MapBaseLayersReducer,
    panelLayers: MapPanelLayersReducer,
  })

  // Use combine reducer for new reducers
  const newRootReducer = combineReducers({
    [ERROR]: ErrorMessageReducer,
    [FILTER]: FiltersReducer,
    [MAP]: MapReducer,
    mapDetail: MapDetailReducer,
    [PANO_PREVIEW]: PanoPreviewReducer,
    [PANORAMA]: PanoramaReducer,
    [UI]: UiReducer,
    [USER]: UserReducer,
    mapLayers,
    [LOCATION]: routeReducer,
    [DETAIL]: DetailReducer,
    [DATA_SEARCH_REDUCER]: DataSearchReducer,
    [SELECTION]: SelectionReducer,
    [DATA_SELECTION]: DataSelectionReducer,
    [DATASETS]: DatasetReducer,
    [FILES_REDUCER]: FilesReducer,
    [SEARCH]: SearchPageReducer,
  })

  // Combine legacy and new reducer states
  return newRootReducer(oldState, action)
}

export default rootReducer

export type RootState = ReturnType<ReturnType<typeof rootReducer>>
