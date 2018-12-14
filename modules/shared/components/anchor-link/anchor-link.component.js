(function () {
    angular
        .module('dpShared')
        .component('dpAnchorLink', {
            bindings: {
                link: '@',
                className: '@',
                autoScroll: '<'
            },
            transclude: true,
            templateUrl: 'modules/shared/components/anchor-link/anchor-link.html',
            controller: DpAnchorLinkController,
            controllerAs: 'vm'
        });

    DpAnchorLinkController.$inject = ['$scope', '$interval', '$anchorScroll'];

    function DpAnchorLinkController ($scope, $interval, $anchorScroll) {
        const vm = this;

        vm.onKeydown = function (event, anchor) {
            if (event.key === 'Enter') {
                vm.scrollTo(anchor);
            }
        };

        vm.scrollTo = function (anchor) {
            $interval(() => {
                $anchorScroll(anchor);
            }, 150, 1);
        };

        if (vm.autoScroll) {
            $scope.$applyAsync(() => {
                vm.scrollTo(vm.link);
            });
        }
    }
})();
