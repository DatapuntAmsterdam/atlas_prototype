import { toHome } from '../../store/redux-first-router/actions';

export const REDUCER_KEY = 'panorama';
export const FETCH_PANORAMA_REQUEST = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST`;
export const FETCH_PANORAMA_SUCCESS = `${REDUCER_KEY}/FETCH_PANORAMA_SUCCESS`;
export const FETCH_PANORAMA_ERROR = `${REDUCER_KEY}/FETCH_PANORAMA_ERROR`;
export const SET_PANORAMA_ORIENTATION = `${REDUCER_KEY}/SET_PANORAMA_ORIENTATION`;
export const SET_PANORAMA_LOCATION = `${REDUCER_KEY}/SET_PANORAMA_LOCATION`;
export const CLOSE_PANORAMA = `${REDUCER_KEY}/CLOSE_PANORAMA`;
export const FETCH_PANORAMA_HOTSPOT_REQUEST = `${REDUCER_KEY}/FETCH_PANORAMA_HOTSPOT_REQUEST`;
export const SET_PANORAMA_TAGS = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST_TOGGLE`;
export const FETCH_PANORAMA_REQUEST_EXTERNAL = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST_EXTERNAL`;

export const PANO_LABELS = [
  {
    layerId: 'pano',
    label: 'Meest recent',
    tags: ['mission-bi']
  },
  {
    layerId: 'pano2018bi',
    label: 'Alleen 2018',
    tags: ['mission-bi', 'mission-2018']
  },
  {
    layerId: 'pano2017bi',
    label: 'Alleen 2017',
    tags: ['mission-bi', 'mission-2017']
  },
  {
    layerId: 'pano2016bi',
    label: 'Alleen 2016',
    tags: ['mission-bi', 'mission-2016']
  },
  {
    layerId: 'pano2018woz',
    label: 'Alleen 2018 WOZ',
    tags: ['mission-woz', 'mission-2018']
  },
  {
    layerId: 'pano2017woz',
    label: 'Alleen 2017 WOZ',
    tags: ['mission-woz', 'mission-2017']
  }
];

export const initialState = {
  location: null,   // eg: [52.8, 4.9]
  tags: PANO_LABELS[0].tags,
  targetLocation: null,
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
  detailReference: [],
  pageReference: ''
};

export const PAGE_REFS = {
  HOME: 'home'
};

export const PAGE_REF_MAPPING = {
  [PAGE_REFS.HOME]: toHome
};
