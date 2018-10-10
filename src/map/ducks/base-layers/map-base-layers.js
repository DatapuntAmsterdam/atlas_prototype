import { createSelector } from 'reselect';

import { getActiveBaseLayer } from '../map/map-selectors';

export const FETCH_MAP_BASE_LAYERS_REQUEST = 'FETCH_MAP_BASE_LAYERS_REQUEST';
export const FETCH_MAP_BASE_LAYERS_SUCCESS = 'FETCH_MAP_BASE_LAYERS_SUCCESS';
export const FETCH_MAP_BASE_LAYERS_FAILURE = 'FETCH_MAP_BASE_LAYERS_FAILURE';

const initialState = {
  items: [],
  isLoading: false,
  error: null
};

const getUrlTemplateOfActiveLayer = (layers, value) => {
  const activeLayer = layers.find((layer) => layer.value === value);
  return activeLayer ? activeLayer.urlTemplate : '';
};

const getAllBaseLayers = (state) => state.mapLayers.baseLayers.items;

export const getBaseLayers = createSelector([getAllBaseLayers],
  (baseLayers) => baseLayers.reduce((result, item) => ({
    ...result,
    [item.category]: result[item.category] ? [...result[item.category], item] :
      [item]
  }), {}));

export const getUrlTemplate = createSelector([getAllBaseLayers, getActiveBaseLayer],
  (baseLayers, activeLayerId) => getUrlTemplateOfActiveLayer(baseLayers, activeLayerId));

export default function MapBaseLayersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MAP_BASE_LAYERS_REQUEST:
      return { ...state, isLoading: true, error: null };

    case FETCH_MAP_BASE_LAYERS_SUCCESS:
      return { ...state, isLoading: false, items: action.mapBaseLayers };

    case FETCH_MAP_BASE_LAYERS_FAILURE:
      return { ...state, isLoading: false, error: action.error };

    default:
      return state;
  }
}

export const fetchMapBaseLayers = () => ({ type: FETCH_MAP_BASE_LAYERS_REQUEST });

