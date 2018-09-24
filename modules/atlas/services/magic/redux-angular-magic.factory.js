// Tight coupling between Redux and Angular global state
// Code extracted from view components that were also doing business logic.
// DO NOT REPEAT ANY OF THESE PATTERNS!!!

import watch from 'redux-watch';
import { MAP_ADD_PANO_OVERLAY, MAP_REMOVE_PANO_OVERLAY } from '../../../../src/map/ducks/map/map';
import {
    getDetailEndpoint,
    getGeosearchLocation,
    isHomePageActive,
    isMapFullscreen,
    isMapOverlaysActive,
    isMapPreviewPanelActive,
    isStraatbeeldActive
} from './selectors';
import { hideMapPanel, showMapPanel } from '../../../../src/shared/ducks/ui/ui';

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

(function () {
    angular
        .module('atlas')
        .factory('reduxAngularMagic', ReduxAngularMagicFactory);

    ReduxAngularMagicFactory.$inject = ['store', '$timeout', '$window'];

    function ReduxAngularMagicFactory (store, $timeout, $window) {
        const { getState, subscribe, dispatch } = store;
        const initialize = () => {
            const watchStraatbeeld = watch(() => isStraatbeeldActive(getState()));
            const watchMapOverlays = watch(() => isMapOverlaysActive(getState()));
            const watchMapFullscreen = watch(() => isMapFullscreen(getState()));
            const watchMapPreviewPanel = watch(() => isMapPreviewPanelActive(getState()));
            const watchGeosearchLocation = watch(() => getGeosearchLocation(getState()));
            const watchDetailEndpoint = watch(() => getDetailEndpoint(getState()));

            subscribe(watchStraatbeeld((active) => {
                const state = getState();
                if (active) {
                    dispatch({ type: MAP_ADD_PANO_OVERLAY, payload: state.straatbeeld });
                } else {
                    $timeout(() => dispatch({ type: MAP_REMOVE_PANO_OVERLAY }));
                }
            }));

            // Todo: probably obsolete, check if this can be removed
            subscribe(watchMapOverlays((active) => {
                const state = getState();
                if (!active && (state.ui.isEmbed || state.ui.isEmbedPreview)) {
                    dispatch(hideMapPanel());
                }
            }));

            // Show or hide React `MapPanel` app according to map fullscreen state
            subscribe(watchMapFullscreen((active) => {
                if (!active) {
                    // Always hide when map exits fullscreen mode
                    store.dispatch(hideMapPanel());
                } else if (isHomePageActive) {
                    // Only show when coming from the home page
                    store.dispatch(showMapPanel());
                }
            }));

            // Open or close React `MapPreviewPanel` app
            function checkMapPreviewPanel () {
                const state = getState();
                const endpointTypes = $window.mapPreviewPanelDetailEndpointTypes || {};
                const detailEndpoint = getDetailEndpoint(state);

                const detailActive = detailEndpoint && Object
                    .keys(endpointTypes)
                    .some((typeKey) => detailEndpoint.includes(endpointTypes[typeKey]));

                if (isMapPreviewPanelActive(state) && (getGeosearchLocation(state) || detailActive)) {
                    store.dispatch({ type: 'OPEN_MAP_PREVIEW_PANEL' });
                } else {
                    store.dispatch({ type: 'CLOSE_MAP_PREVIEW_PANEL' });
                }
            }

            subscribe(watchMapPreviewPanel(checkMapPreviewPanel));
            subscribe(watchGeosearchLocation(checkMapPreviewPanel));
            subscribe(watchDetailEndpoint(checkMapPreviewPanel));

            // Hack to initially call the checkMapPreview, as it's not called the first time
            // because the default values didn't change when initialize the app
            $timeout(checkMapPreviewPanel);
        };

        return {
            initialize
        };
    }
})();
