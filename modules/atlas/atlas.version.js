(function () {
    'use strict';

    angular
        .module('atlas')
        .constant('ATLAS_VERSION', {
            version: VERSION,   // eslint-disable-line no-undef
            build: __BUILD_ID__ // eslint-disable-line no-undef
        });
})();
