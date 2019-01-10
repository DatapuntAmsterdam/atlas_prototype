import { getPageActionEndpoint } from '../../../src/store/redux-first-router/actions';
import { DETAIL_VIEW } from '../../../src/shared/ducks/detail/constants';

(function () {
    'use strict';

    angular
        .module('dpShared')
        .filter('detailEndpointAction', detailEndpointAction);

    function detailEndpointAction () {
        return (endpoint) => {
            if (!endpoint) {
                return;
            }
            const action = getPageActionEndpoint(endpoint, DETAIL_VIEW.MAP_DETAIL);
            return action;
        };
    }
})();
