import { ViewMode } from '../ui/ui'
import {
  DatasetType,
  LegacyDataSelectionViewTypes,
} from '../../../app/components/DataSelection/types'

export const REDUCER_KEY = 'dataSelection'

export const FETCH_MARKERS_REQUEST = `${REDUCER_KEY}/FETCH_MARKERS_REQUEST`
export const FETCH_MARKERS_SUCCESS = `${REDUCER_KEY}/FETCH_MARKERS_SUCCESS`
export const FETCH_MARKERS_FAILURE = `${REDUCER_KEY}/FETCH_MARKERS_FAILURE`

export const REMOVE_GEOMETRY_FILTER = `${REDUCER_KEY}/REMOVE_GEOMETRY_FILTER`
export const SET_GEOMETRY_FILTER = `${REDUCER_KEY}/SET_GEOMETRY_FILTER`
export const RESET_DATA_SELECTION = `${REDUCER_KEY}/RESET_DATA_SELECTION`
export const CANCEL_DATA_SELECTION = `${REDUCER_KEY}/CANCEL_DATA_SELECTION`
export const START_DATA_SELECTION = `${REDUCER_KEY}/START_DATA_SELECTION`
export const END_DATA_SELECTION = `${REDUCER_KEY}/END_DATA_SELECTION`

export const SET_PAGE = `${REDUCER_KEY}/SET_PAGE`

export const VIEWS_TO_PARAMS = {
  [ViewMode.Split]: LegacyDataSelectionViewTypes.List,
  [ViewMode.Map]: LegacyDataSelectionViewTypes.List,
  [ViewMode.Full]: LegacyDataSelectionViewTypes.Table,
}

export const DATASETS = {
  BAG: DatasetType.Bag,
  BRK: DatasetType.Brk,
  HR: DatasetType.Hr,
}

export const initialState = {
  isLoading: false,
  loadingMarkers: false,
  markers: [], // eg: [[52.1, 4.1], [52.2, 4.0]],
  geometryFilter: {
    markers: undefined,
  },
  dataset: DATASETS.BAG,
  authError: false,
  errorMessage: '',
  page: 1,
}
