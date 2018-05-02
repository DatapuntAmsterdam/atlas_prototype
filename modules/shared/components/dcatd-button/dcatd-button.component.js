(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpDcatdButton', {
            templateUrl: 'modules/shared/components/dcatd-button/dcatd-button.html',
            transclude: true,
            bindings: {
                id: '@',
                type: '@',  // wijzigen or toevoegen
                link: '@'
            },
            controller: DpDcatdButtonController,
            controllerAs: 'vm'
        });

    DpDcatdButtonController.$inject = ['$window'];

    function DpDcatdButtonController ($window) {
        const vm = this;

        function onClick () {
            sessionStorage.setItem('DCATD_REDIRECT_URL', document.location.href);
            $window.location = vm.link;
        }

        vm.onClick = onClick;
        vm.link = `/dcatd_admin#/datasets/${vm.id}`;
    }
})();
