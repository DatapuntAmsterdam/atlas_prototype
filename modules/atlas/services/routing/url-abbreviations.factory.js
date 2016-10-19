(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlAbbreviations', urlAbbreviationsFactory);

    urlAbbreviationsFactory.$inject = ['ABBREVIATIONS'];

    function urlAbbreviationsFactory (ABBREVIATIONS) {
        const abbreviations = new Map();

        // Construct a map from the ABBREVIATIONS oobject
        // Reason: Maps do not prevent duplicate keys
        Object.keys(ABBREVIATIONS).forEach(key => {
            abbreviations.set(ABBREVIATIONS[key], key);
        });

        return {
            abbreviations: abbreviations
        };
    }
})();
