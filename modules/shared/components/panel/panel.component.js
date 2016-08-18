(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpPanel', {
            bindings: {
                heading: '@'
            },
            transclude: {
                'icon': '?dpPanelIcon',
                'body': 'dpPanelBody'
            },
            templateUrl: 'modules/shared/components/panel/panel.html',
            controllerAs: 'vm'
        });
})();