import { toDetailFromEndpoint } from '../../../src/store/redux-first-router/actions';
import { VIEW_MODE } from '../../../src/shared/ducks/ui/ui';

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
            const action = toDetailFromEndpoint(endpoint, VIEW_MODE.SPLIT);
            return action;
        };
    }
})();
