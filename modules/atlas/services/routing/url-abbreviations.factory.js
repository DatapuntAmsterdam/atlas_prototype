(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlAbbreviations', urlAbbreviationsFactory);

    urlAbbreviationsFactory.$inject = ['ABBREVIATIONS'];

    function urlAbbreviationsFactory (ABBREVIATIONS) {
        const abbreviations = new Map();

        /**
         * Construct a map from the ABBREVIATIONS object
         * Reason: Maps do not prevent duplicate keys
         */
        Object.keys(ABBREVIATIONS).forEach(variableName => {
            abbreviations.set(variableName, ABBREVIATIONS[variableName]);
        });

        return {
            abbreviations: abbreviations
        };
    }
})();
