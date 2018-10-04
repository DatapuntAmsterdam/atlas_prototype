// Tight coupling between Redux and Angular global state
// Code extracted from view components that were also doing business logic.
// DO NOT REPEAT ANY OF THESE PATTERNS!!!

import watch from 'redux-watch';
import { MAP_ADD_PANO_OVERLAY, MAP_REMOVE_PANO_OVERLAY } from '../../../map/ducks/map/map';
import { isStraatbeeldActive } from './redux-watch-selectors';

// mimics dashboard.component behavior:
// $scope.$watchGroup(['vm.isStraatbeeldActive', 'vm.straatbeeldHistory'], () => {
//     console.log('watcher firing');
//     if (vm.isStraatbeeldActive) {
//         store.dispatch({ type: ACTIONS.MAP_ADD_PANO_OVERLAY.id, payload: ... });
//     } else {
//         $timeout(() => store.dispatch({ type: ACTIONS.MAP_REMOVE_PANO_OVERLAY.id }));
//     }
// });
//
// along with:
// store.subscribe(() => {
//   vm.isStraatbeeldActive = Boolean(state.straatbeeld);
//   vm.straatbeeldHistory = vm.isStraatbeeldActive ? state.straatbeeld.history : null;
// });
//

function ReduxWatcher(store) {
  const { getState, subscribe, dispatch } = store;
  const watchStraatbeeld = watch(() => isStraatbeeldActive(getState()));

  subscribe(watchStraatbeeld((active) => {
    const state = getState();
    if (active) {
      dispatch({ type: MAP_ADD_PANO_OVERLAY, payload: state.straatbeeld });
    } else {
      setTimeout(() => dispatch({ type: MAP_REMOVE_PANO_OVERLAY }));
    }
  }));
}

export default ReduxWatcher;
