import {
  initialState,
  getPanoramaHeading,
  getPanoramaPitch,
  SET_PANORAMA_ORIENTATION
} from './panorama';

export default {
  heading: {
    selector: getPanoramaHeading,
    defaultValue: initialState.heading
  },
  pitch: {
    selector: getPanoramaPitch,
    defaultValue: initialState.pitch
  }
};

export const ACTIONS = [SET_PANORAMA_ORIENTATION];
