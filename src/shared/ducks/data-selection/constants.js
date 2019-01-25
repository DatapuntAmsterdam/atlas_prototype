import { routing } from '../../../app/routes';
import { VIEW_MODE } from '../ui/ui';

export const REDUCER_KEY = 'dataSelection';
export const FETCH_DATA_SELECTION_REQUEST = `${REDUCER_KEY}/FETCH_DATA_SELECTION_REQUEST`;
export const FETCH_DATA_SELECTION_SUCCESS = `${REDUCER_KEY}/FETCH_DATA_SELECTION_SUCCESS`;
export const FETCH_DATA_SELECTION_FAILURE = `${REDUCER_KEY}/FETCH_DATA_SELECTION_FAILURE`;

export const FETCH_MARKERS_REQUEST = `${REDUCER_KEY}/FETCH_MARKERS_REQUEST`;
export const FETCH_MARKERS_SUCCESS = `${REDUCER_KEY}/FETCH_MARKERS_SUCCESS`;
export const FETCH_MARKERS_FAILURE = `${REDUCER_KEY}/FETCH_MARKERS_FAILURE`;

export const DOWNLOAD_DATA_SELECTION = `${REDUCER_KEY}/DOWNLOAD_DATA_SELECTION`;
export const REMOVE_GEOMETRY_FILTER = `${REDUCER_KEY}/REMOVE_GEOMETRY_FILTER`;
export const SET_GEOMETRY_FILTER = `${REDUCER_KEY}/SET_GEOMETRY_FILTER`;
export const RESET_DATA_SELECTION = `${REDUCER_KEY}/RESET_DATA_SELECTION`;
export const CANCEL_DATA_SELECTION = `${REDUCER_KEY}/CANCEL_DATA_SELECTION`;
export const START_DATA_SELECTION = `${REDUCER_KEY}/START_DATA_SELECTION`;
export const END_DATA_SELECTION = `${REDUCER_KEY}/END_DATA_SELECTION`;

export const SET_PAGE = `${REDUCER_KEY}/SET_PAGE`;
export const SET_DATASET = `${REDUCER_KEY}/SET_DATASET`;
export const ROUTE_DATASET_MAPPER = {
  [routing.cadastralObjects.type]: 'brk',
  [routing.establishments.type]: 'hr',
  [routing.addresses.type]: 'bag'
};

export const VIEWS_TO_PARAMS = {
  [VIEW_MODE.SPLIT]: 'LIST',
  [VIEW_MODE.MAP]: 'MAP',
  [VIEW_MODE.FULL]: 'TABLE'
};

export const DATASETS = {
  BAG: 'bag',
  BRK: 'brk',
  HR: 'hr'
};

export const DATASET_ROUTE_MAPPER = {
  [DATASETS.HR]: routing.establishments.type,
  [DATASETS.BAG]: routing.addresses.type,
  [DATASETS.BRK]: routing.cadastralObjects.type
};

export const initialState = {
  isLoading: false,
  loadingMarkers: false,
  markers: [], // eg: [[52.1, 4.1], [52.2, 4.0]],
  geometryFilter: {
    markers: undefined
  },
  dataset: DATASETS.BAG,
  authError: false,
  errorMessage: '',
  page: 1
};
