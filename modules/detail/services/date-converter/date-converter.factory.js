(function () {
    'use strict';
    angular
        .module('atlasDetail')
        .factory('dateConverter', dateConverterService);

    dateConverterService.$inject = ['d3'];
    /* @ngInject */

    function dateConverterService (d3) {
        return {
            ymdToDate: ymdToDate
        };

        /**
         * @param input
         * @returns {*}
         */
        function ymdToDate (input) {
            var parseDate = d3.time.format('%Y-%m-%d').parse;

            return parseDate(input);
        }
    }
})();
