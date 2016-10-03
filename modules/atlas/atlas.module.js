/*
 * @ngdoc overview
 * @name atlas.module:atlas
 *
 * @description
 *
 * The main module for the atlas application. This module contains the controllers
 * used through the app, as well as all reducers.
*/
(function () {
    'use strict';

    angular
        .module('atlas', [
            'atlasHeader',
            'atlasPage',
            'atlasDetail',
            'atlasSearchResults',
            'atlasLayerSelection',
            'dpMap',
            'dpStraatbeeld',
            'dpDataSelection',

            'dpShared'
        ]);
})();