export const STRAATBEELD_OFF = 'STRAATBEELD_OFF';

const initialState = {
  location: null, // eg: [52.8, 4.9]
  history: 0,     // eg: 2016
  pitch: 0,       // eg: -10
  heading: 0,     // eg: 270
  fov: 0,         // eg: 65
  image: null,    // eg: {
                  //     pattern: 'http://www.example.com/path/some-id/{this}/{that}/{thingie}.jpg',
                  //     preview: 'http://www.example.com/path/some-id/preview.jpg'
                  // }
  hotspots: [],   // eg: [{id: 'ABC124', heading: 90, distance: 18}],
  date: null,     // eg: new Date()
  isFullscreen: false, // TODO: remove, no longer used
  isInitial: true,
  isLoading: true
};

export default function StraatbeeldReducer(state = initialState, action) {
  switch (action.type) {
    case 'HIDE_STRAATBEELD': // TODO REMOVE HACK
      return null;
    case STRAATBEELD_OFF:
      return null;

    default:
      return state;
  }
}

export const setStraatbeeldOff = () => ({ type: STRAATBEELD_OFF });

