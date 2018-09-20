// Tight coupling between Redux and Angular global state
// Code extracted from view components that were also doing business logic.
// DO NOT REPEAT ANY OF THESE PATTERNS!!!

import watch from 'redux-watch';
import { createSelector } from 'reselect';
import { MAP_ADD_PANO_OVERLAY, MAP_REMOVE_PANO_OVERLAY } from '../../../../src/map/ducks/map/map';

// mimics dashboard.component behavior:
// $scope.$watchGroup(['vm.isStraatbeeldActive', 'vm.straatbeeldHistory'], () => {
//     console.log('watcher firing');
//     if (vm.isStraatbeeldActive) {
//         store.dispatch({ type: ACTIONS.MAP_ADD_PANO_OVERLAY.id, payload: store.getState().straatbeeld });
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
const getStraatbeeld = (state) => state.straatbeeld;
const getStraatbeeldHistory = (state) => state.straatbeeld && state.straatbeeld.history;

(function () {
    angular
        .module('atlas')
        .factory('reduxAngularMagic', ReduxAngularMagicFactory);

    ReduxAngularMagicFactory.$inject = ['store', '$timeout'];

    function ReduxAngularMagicFactory (store, $timeout) {
        const initialize = () => {
            const checkStraatbeeldChange = createSelector(
                [getStraatbeeld, getStraatbeeldHistory],
                (straatbeeld, history) => {
                    return Boolean(straatbeeld) || history;
                }
            );

            const watchStraatbeeld = watch(() => checkStraatbeeldChange(store.getState()));
            store.subscribe(watchStraatbeeld(() => {
                const state = store.getState();
                if (state.straatbeeld) {
                    store.dispatch({ type: MAP_ADD_PANO_OVERLAY, payload: state.straatbeeld });
                } else {
                    $timeout(() => store.dispatch({ type: MAP_REMOVE_PANO_OVERLAY }));
                }
            }));
        };

        return {
            initialize
        };
    }
})();
