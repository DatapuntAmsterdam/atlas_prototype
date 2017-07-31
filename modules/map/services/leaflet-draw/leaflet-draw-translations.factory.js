((() => {
    'use strict';

    angular
        .module('dpMap')
        .factory('leafletDrawTranslations', leafletDrawTranslationsFactory);

    leafletDrawTranslationsFactory.$inject = ['L'];

    function leafletDrawTranslationsFactory (L) {
        return {
            initialize
        };

        function initialize () {
            clearTexts(L.drawLocal);
        }

        function clearTexts (obj) {
            // Set all text properties to en ampty string
            Object.keys(obj).forEach(key => {
                if (angular.isObject(obj[key])) {
                    clearTexts(obj[key]);
                } else if (angular.isString(obj[key])) {
                    obj[key] = '';
                }
            });
        }
    }
}))();
