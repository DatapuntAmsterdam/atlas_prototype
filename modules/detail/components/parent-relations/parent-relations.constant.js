(function () {
    'use strict';

    angular
        .module('dpDetail')
        .constant('PARENT_RELATIONS_CONFIG', [
            'stadsdeel',
            'buurtcombinatie',
            'buurt',
            'bouwblok'
        ]);
})();
