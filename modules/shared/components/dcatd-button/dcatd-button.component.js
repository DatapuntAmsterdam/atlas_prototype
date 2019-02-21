import { routing } from '../../../../src/app/routes';

(() => {
    'use strict';

    angular
        .module('dpShared')
        .component('dpDcatdButton', {
            templateUrl: 'modules/shared/components/dcatd-button/dcatd-button.html',
            transclude: true,
            bindings: {
                id: '@',
                type: '@'  // wijzigen or toevoegen
            },
            controller: DpDcatdButtonController,
            controllerAs: 'vm'
        });

    DpDcatdButtonController.$inject = ['$scope', '$window'];

    function DpDcatdButtonController ($scope, $window) {
        const vm = this;

        function onClick () {
            sessionStorage.setItem('DCATD_DETAIL_REDIRECT_URL', document.location.href);
            sessionStorage.setItem('DCATD_LIST_REDIRECT_URL', `${document.location.origin}${routing.datasets.path}`);

            $window.location.assign(`/dcatd_admin#/datasets/${vm.id}`);
        }

        vm.onClick = onClick;
    }
})();
