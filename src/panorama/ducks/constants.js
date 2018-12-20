import PANORAMA_VIEW from './panorama-view';

export const REDUCER_KEY = 'panorama';
export const FETCH_PANORAMA_REQUEST = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST`;
export const FETCH_PANORAMA_SUCCESS = `${REDUCER_KEY}/FETCH_PANORAMA_SUCCESS`;
export const FETCH_PANORAMA_ERROR = `${REDUCER_KEY}/FETCH_PANORAMA_ERROR`;
export const SET_PANORAMA_ORIENTATION = `${REDUCER_KEY}/SET_PANORAMA_ORIENTATION`;
export const SET_PANORAMA_YEAR = `${REDUCER_KEY}/SET_PANORAMA_YEAR`;
export const SET_PANORAMA_LOCATION = `${REDUCER_KEY}/SET_PANORAMA_LOCATION`;
export const SET_PANORAMA_VIEW = `${REDUCER_KEY}/SET_PANORAMA_VIEW`;
export const CLOSE_PANORAMA = `${REDUCER_KEY}/CLOSE_PANORAMA`;
export const FETCH_PANORAMA_REQUEST_TOGGLE = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST_TOGGLE`;
export const historyOptions = [
  { year: 0, missionType: '', label: 'Meest recent', layerName: 'pano' },
  { year: 2018, missionType: 'bi', label: 'Alleen 2018 regulier', layerName: 'pano2018bi' },
  { year: 2018, missionType: 'woz', label: 'Alleen 2018 WOZ', layerName: 'pano2018woz' },
  { year: 2017, missionType: 'bi', label: 'Alleen 2017 regulier', layerName: 'pano2017bi' },
  { year: 2017, missionType: 'woz', label: 'Alleen 2017 WOZ', layerName: 'pano2017woz' },
  { year: 2016, missionType: 'bi', label: 'Alleen 2016 regulier', layerName: 'pano2016bi' }
];

export const initialState = {
  view: PANORAMA_VIEW.MAP_PANO,
  location: null,   // eg: [52.8, 4.9]
  history: historyOptions[0],
  pitch: 0,         // eg: -10
  heading: 0,       // eg: 270
  fov: null,        // eg: 65
  image: null,      // eg: {
                    //     pattern: 'http://www.example.com/path/some-id/{this}/{that}/{thingie}.jpg',
                    //     preview: 'http://www.example.com/path/some-id/preview.jpg'
                    // }
  hotspots: [],     // eg: [{id: 'ABC124', heading: 90, distance: 18}],
  date: null,       // eg: new Date()
  isLoading: true,
  reference: []
};
