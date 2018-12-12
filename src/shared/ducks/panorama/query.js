import { getPanoramaHeading, getPanoramaPitch, getPanoramaView, getReference } from './selectors';
import { initialState, SET_PANORAMA_ORIENTATION, SET_PANORAMA_VIEW } from './constants';

const getRef = (state) => (getReference(state) ?
  JSON.stringify(getReference(state)) :
  initialState.reference
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
    decode: (val) => (val ? val.split(',') : initialState.reference),
    defaultValue: initialState.reference
  },
  panoramaMode: {
    stateKey: 'view',
    selector: getPanoramaView,
    decode: (val) => val,
    defaultValue: initialState.view
  }
};

export const ACTIONS = [SET_PANORAMA_ORIENTATION, SET_PANORAMA_VIEW];
