/* eslint-disable no-param-reassign */
import deepCopy from 'deep-copy';  // Deprecated, added during Angular to Vanilla migration. Try ES6 Object.assign and the like where possible.
import { stripDomain, restoreDomain } from './uri-stripper';
import isObject from '../is-object';
import { historyOptions } from '../../../panorama/ducks/panorama';

//
// This constant holds the configuration of all state variables that are stored in the url
// - The url parameter name can be found in stateVariables.<parameterName>
//   The association between the state variable and the url parameter
//    is described by the name (eg 'map.zoom')
//   The type of the parameter is described by the type parameter
// - Any default value can be found in initialValues.<parameterName>
// - The default state is described in onCreate.DEFAULT
// - Any other default processing for a state object is described in onCreate.<stateObject>
// - The state variables that are copied from a previous state are described in post.<stateObject>
//
// To include a state variable (stateObject.stateVariable) in the url:
// - Define a unique short name for the variable
// - Define the type of the variable
// - Add <shortName>: { name: 'stateObject.stateVariable', type: <typeName> } to stateVariables
//
// Note: The depth of the stateVariable in the stateObject is free
//       eg 'map.x.y.z' is perfectly valid and corresponds to map: { x: { y: { z: <anyValue> } } }
//
// Valid types for state variables are:
// - string
// - boolean
// - number (precision van be specified in the precison property of the stateVariable)
// - base62 (encode any number in base 62, 0-9A-Za-z, precision van be specified in the
// precison property)
// and the complex types:
// - []
//   eg number[] for a coordinate like [52, 4] which will store as '52:4' in the url
// - keyvalues
//   for { key: stringValue, key: stringValue, ... } objects
//   like { aap: 'noot', mies: 'wim' } which will store as 'aap::noot:mies::wim' in the url
// - object(key:typeName,key:typeName,...)
//   for { key: valueOfType, key: valueOfType, ... } objects
//   like object(aap:string,mies:number) for { aap: 'noot', mies: 5 } which will store as
// 'noot:5' in the url
//

/**
 * Deprecated function. Introduced to replace angular.equal while removing Angular from code.
 */
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* istanbul ignore next */
const ofTypeArray = (oldState, newState) => // eslint-disable-line no-confusing-arrow
  Array.isArray(oldState) ? oldState : newState;
/* istanbul ignore next */
const ofTypeObject = (oldState, newState) => // eslint-disable-line no-confusing-arrow
  isObject(oldState) ? oldState : newState;
/* istanbul ignore next */
const ofTypeBoolean = (oldState, newState) => // eslint-disable-line no-confusing-arrow
  oldState === true || oldState === false ? oldState : newState;

export default {
  onCreate: {
    // Initialisation methods for the url2state conversion
    // These methods are executed after a state object has been initialized with the initialValues
    DEFAULT: (oldState, newState, params, initialValues) => {
      [
        'filters',
        'isMapPreviewPanelVisible',
        'mapSearchResults',
        'mapSearchResultsByLocation',
        'mapDetail',
        'mapClickLocation',
        'page',
        'ui',
        'user'
      ].forEach((s) => {
        const value = initialValues[s];
        newState[s] = typeof value !== 'undefined'
          ? (Array.isArray(value)
            ? [...value]
            : isObject(value)
              ? { ...value }
              : value)
          : value;
      });
      // Replaced: if (angular.equals(params, {})) {
      if (isObject(params) && Object.keys(params).length === 0) {
        // When no params, go to home page and show initial map
        newState.page.name = 'home';
        newState.map = deepCopy(initialValues.map);
      }
      return newState;
    }
  },
  post: {
    // Post processing methods
    // These methods are exectuted when the url2state conversion has finished
    dataSelection: (oldState, newState) => {
      if (isObject(oldState)) {
        newState.markers = oldState.markers;
        newState.isLoading = oldState.isLoading;
      }
      newState.isFullscreen = newState.view !== 'LIST';
      return newState;
    },
    detail: (oldState, newState) => {
      if (isObject(oldState) && oldState.endpoint === newState.endpoint) {
        newState.display = oldState.display;
        newState.geometry = oldState.geometry;
        newState.isLoading = oldState.isLoading;
        newState.isFullscreen = oldState.isFullscreen;
        newState.skippedSearchResults = oldState.skippedSearchResults;
      }
      return newState;
    },
    map: (oldState, newState) => {
      if (isObject(oldState)) {
        newState.boundingBox = oldState.boundingBox;
        newState.drawingMode = oldState.drawingMode;
        newState.isLoading = oldState.isLoading;
        newState.shapeMarkers = oldState.shapeMarkers;
        newState.shapeDistanceTxt = oldState.shapeDistanceTxt;
        newState.shapeAreaTxt = oldState.shapeAreaTxt;
      }
      return newState;
    },
    search: (oldState, newState) => {
      const hasOldState = isObject(oldState);
      const hasInputChanged = hasOldState && (
        oldState.query !== newState.query ||
        !deepEqual(oldState.location, newState.location) ||
        oldState.category !== newState.category
      );

      if (hasInputChanged) {
        newState.numberOfResults = null;
        newState.isLoading = true;
      } else if (hasOldState) {
        newState.numberOfResults = oldState.numberOfResults;
        newState.isLoading = oldState.isLoading;
      }

      return newState;
    },
    panorama: (oldState, newState) => {
      if (isObject(oldState)) {
        newState.targetLocation = oldState.targetLocation;

        if (oldState.id === newState.id) {
          newState.image = oldState.image;
          newState.history = oldState.history;
          newState.hotspots = oldState.hotspots;
          newState.date = oldState.date;
          newState.location = oldState.location;
          newState.isInitial = false;
          newState.isLoading = oldState.isLoading;
        }
      }
      return newState;
    },
    mapBaseLayers: ofTypeObject,
    user: ofTypeObject,
    mapSearchResults: ofTypeArray,
    mapSearchResultsByLocation: ofTypeObject,
    mapDetail: ofTypeObject,
    mapClickLocation: ofTypeObject,
    isMapPreviewPanelVisible: ofTypeBoolean,
    ui: (oldState, newState) => {
      if (isObject(oldState)) {
        // Do not keep the state of the drawing mode
        newState.isMapPanelHandleVisible = oldState.isMapPanelHandleVisible;
      }
      return newState;
    }
  },
  initialValues: {
    // When creating a state object it will be initialized with these values
    user: {
      authenticated: false,
      accessToken: '',
      scopes: [],
      name: '',
      error: false
    },
    detail: {
      isFullscreen: false,
      isLoading: true,
      skippedSearchResults: false
      // endpoint: 'http://api.example.com/bag/verblijfsobject/123/',
      // display: 'This is the _display variable as available in each endpoint',
      // geometry: null,
    },
    filters: {},
    map: {
      viewCenter: [52.3731081, 4.8932945],
      baseLayer: 'topografie',
      zoom: 11,
      overlays: [],
      isLoading: false,
      drawingMode: 'none',
      shapeMarkers: 0,
      shapeDistanceTxt: '',
      shapeAreaTxt: '',
      selectedLocation: null,
      mapPanelActive: true
    },
    mapSearchResults: [],
    mapSearchResultsByLocation: {},
    mapDetail: {
      isLoading: false,
      currentEndpoint: '',
      byEndpoint: {}
    },
    mapClickLocation: {},
    isMapPreviewPanelVisible: false,
    page: {
      name: null  // eg: 'home'
    },
    search: {
      query: null,    // eg: 'linnaeus'
      location: null, // eg: [52.123, 4.789]
      category: null,
      isLoading: true
      // numberOfResults: null
    },
    panorama: {
      location: null, // eg: [52.8, 4.9]
      history: historyOptions[0],
      pitch: 0,       // eg: -10
      heading: 0,     // eg: 270
      fov: 0,         // eg: 65
      image: null,    // eg: {
                      //     pattern: 'http://www.example.com/path/some-id/{this}/{that}/{thingie}.jpg',
                      //     preview: 'http://www.example.com/path/some-id/preview.jpg'
                      // }
      hotspots: [],   // eg: [{id: 'ABC124', heading: 90, distance: 18}],
      date: null,     // eg: new Date()
      isFullscreen: false,
      isInitial: true,
      isLoading: true
    },
    ui: {
      isEmbed: false,
      isEmbedPreview: false,
      isMapFullscreen: false,
      isMapLayersVisible: true,
      isMapPanelVisible: false,
      isMapPanelHandleVisible: true,
      isPrintMode: false
    }
  },
  stateVariables: {
    // Property names are keys so that the compiler guarantees the uniqness
    // The type is stored with the name, every state variable has to have a type specification
    // atlas (at)
    atp: {
      name: 'ui.isPrintMode',
      type: 'boolean'
    },
    ate: {
      name: 'ui.isEmbed',
      type: 'boolean'
    },
    atep: {
      name: 'ui.isEmbedPreview',
      type: 'boolean'
    },
    // dataSelection (ds)
    dsd: {
      name: 'dataSelection.dataset',
      type: 'string'
    },
    dsgf: {
      name: 'dataSelection.geometryFilter.markers',
      type: 'base62[][]',
      precision: 7
    },
    dsgd: {
      name: 'dataSelection.geometryFilter.description',
      type: 'string'
    },
    dsp: {
      name: 'dataSelection.page',
      type: 'number'
    },
    dsq: {
      name: 'dataSelection.query',
      type: 'string'
    },
    dsv: {
      name: 'dataSelection.view',
      type: 'string'
    },
    // detail (dt)
    dte: {
      name: 'detail.endpoint',
      type: 'string[]',
      // stripDomain is wrapped in function so it can be mocked
      getValue: (value) => stripDomain(value),
      // restoreDomain is wrapped in function so it can be mocked
      setValue: (value) => restoreDomain(value)
    },
    dtfs: {
      name: 'detail.isFullscreen',
      type: 'boolean'
    },
    // filters (f) for back compatibility using dsf
    dsf: {
      name: 'filters',
      type: 'keyvalues'
    },
    // header (hd, not used)
    // map (mp)
    mpb: {
      name: 'map.baseLayer',
      type: 'string'
    },
    mpz: {
      name: 'map.zoom',
      type: 'number'
    },
    mpfs: {
      name: 'ui.isMapFullscreen',
      type: 'boolean'
    },
    mpg: {
      name: 'map.geometry',
      type: 'base62[][]',
      precision: 7
    },
    mpo: {
      name: 'map.overlays',
      type: 'object(id:string,isVisible:boolean)[]'
    },
    mpv: {
      name: 'map.viewCenter',
      type: 'number[]',
      precision: 7
    },
    // page (pg)
    pgn: {
      name: 'page.name',
      type: 'string'
    },
    pgi: {
      name: 'page.item',
      type: 'string'
    },
    pgt: {
      name: 'page.type',
      type: 'string'
    },
    // search (sr)
    src: {
      name: 'search.category',
      type: 'string'
    },
    srfs: {
      name: 'search.isFullscreen',
      type: 'boolean'
    },
    srl: {
      name: 'search.location',
      type: 'base62[]',
      precision: 7
    },
    srq: {
      name: 'search.query',
      type: 'string'
    },
    // panorama (sb)
    sbf: {
      name: 'panorama.fov',
      type: 'base62',
      precision: 1
    },
    sbfs: {
      name: 'panorama.isFullscreen',
      type: 'boolean'
    },
    sbh: {
      name: 'panorama.heading',
      type: 'base62',
      precision: 1
    },
    sbi: {
      name: 'panorama.id',
      type: 'string'
    },
    sbl: {
      name: 'panorama.location',
      type: 'base62[]',
      precision: 7
    },
    sbp: {
      name: 'panorama.pitch',
      type: 'base62',
      precision: 1
    },
    sby: {
      name: 'panorama.history.year',
      type: 'base62',
      precision: 1
    },
    sbmt: {
      name: 'panorama.history.missionType',
      type: 'string'
    },
    sbln: {
      name: 'panorama.history.layerName',
      type: 'string'
    },
    sblb: {
      name: 'panorama.history.label',
      type: 'string'
    },
    // UI visibility (uv)
    uvm: {
      name: 'ui.isMapPanelVisible',
      type: 'boolean'
    }
  }
};
