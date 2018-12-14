import {
  getDataSearchLocation,
  getSearchCategory,
  getSearchQuery
} from './selectors';
import { initialState, SET_GEO_LOCATION, SET_QUERY_CATEGORY } from './constants';
import parseLocationString from '../../../map/ducks/map/location-parse';

const getLocationString = (state) => {
  const location = getDataSearchLocation(state);
  if (location) {
    return `${location.latitude},${location.longitude}`;
  }
  return undefined;
};

export default {
  zoekterm: {
    stateKey: 'query',
    selector: getSearchQuery,
    decode: (val) => val,
    defaultValue: null
  },
  categorie: {
    stateKey: 'category',
    selector: getSearchCategory,
    decode: (val) => val,
    defaultValue: initialState.category,
    addHistory: true
  },
  locatie: {
    stateKey: 'geoSearch',
    selector: getLocationString,
    decode: (val) => {
      if (val) {
        const latLngObj = parseLocationString(val);
        return {
          latitude: latLngObj.lat,
          longitude: latLngObj.lng
        };
      }
      return null;
    },
    defaultValue: null
  }
};

export const ACTIONS = [SET_GEO_LOCATION, SET_QUERY_CATEGORY];
