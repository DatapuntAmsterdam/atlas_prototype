(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stateToUrl', stateToUrlFactory);

    stateToUrlFactory.$inject = ['$location', 'stateUrlConverter'];

    function stateToUrlFactory ($location, stateUrlConverter) {
        return {
            create,
            update
        };

        function create (state) {
            return stateUrlConverter.state2url(state);
        }

        function update (state, useReplace) {
            if (useReplace) {
                $location.replace();
            }
            $location.search(stateUrlConverter.state2params(state));
        }
    }
})();
