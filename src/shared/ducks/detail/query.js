import { getDetailView } from './selectors';
import { SET_VIEW, initialState } from './constants';

export default {
  detailModus: {
    stateKey: 'view',
    selector: getDetailView,
    decode: (val) => val,
    defaultValue: initialState.view
  }
};

export const ACTIONS = [SET_VIEW];
