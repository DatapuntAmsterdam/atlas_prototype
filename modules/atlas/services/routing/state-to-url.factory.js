((() => {
    'use strict';

    angular
        .module('atlas')
        .factory('stateToUrl', stateToUrlFactory);

    stateToUrlFactory.$inject = ['$location', 'stateUrlConverter'];

    function stateToUrlFactory ($location, stateUrlConverter) {
        return {
            update
        };

        function update (state, useReplace) {
            if (useReplace) {
                $location.replace();
            }
            $location.search(stateUrlConverter.state2params(state));
        }
    }
}))();
