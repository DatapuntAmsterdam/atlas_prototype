(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('dateConverter', dateConverterFactory);

    dateConverterFactory.$inject = ['d3'];

    function dateConverterFactory (d3) {
        return {
            ymdToDate: ymdToDate
        };

        function ymdToDate (input) {
            var parseDate = d3.time.format('%Y-%m-%d').parse;

            return parseDate(input);
        }
    }
})();
