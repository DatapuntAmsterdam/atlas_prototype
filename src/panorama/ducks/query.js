import {
  getPanoramaHeading,
  getPanoramaLocation,
  getPanoramaPitch,
  getPanoramaView,
  getReference
} from './selectors';
import { initialState, SET_PANORAMA_ORIENTATION, SET_PANORAMA_VIEW } from './constants';

const getRef = (state) => (getReference(state).length ?
    getReference(state).join() :
    initialState.reference
);

const getLocation = (state) => (
  getPanoramaLocation(state) ? getPanoramaLocation(state).join() : initialState.location
);

export default {
  heading: {
    stateKey: 'heading',
    selector: getPanoramaHeading,
    decode: (val) => val,
    defaultValue: initialState.heading
  },
  pitch: {
    stateKey: 'pitch',
    selector: getPanoramaPitch,
    decode: (val) => val,
    defaultValue: initialState.pitch
  },
  reference: {
    stateKey: 'reference',
    selector: getRef,
    decode: (val) => (val.length ? val.split(',') : initialState.reference),
    defaultValue: initialState.reference
  },
  panoramaMode: {
    stateKey: 'view',
    selector: getPanoramaView,
    decode: (val) => val,
    defaultValue: initialState.view
  },
  panoramaLocation: {
    stateKey: 'location',
    selector: getLocation,
    decode: (val) => (val ? val.split(',').map((string) => parseFloat(string)) : initialState.location),
    defaultValue: initialState.location
  }
};

export const ACTIONS = [SET_PANORAMA_ORIENTATION, SET_PANORAMA_VIEW];
