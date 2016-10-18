(function () {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpStelselpediaMeta', dpStelselpediaMetaDirective);

    function dpStelselpediaMetaDirective () {
        return {
            restrict: 'E',
            scope: {
                definition: '@',
                apiData: '='
            },
            templateUrl: 'modules/detail/components/stelselpedia/meta/stelselpedia-meta.html',
            transclude: true,
            controller: DpStelselpediaMetaController,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    DpStelselpediaMetaController.$inject = ['STELSELPEDIA'];

    function DpStelselpediaMetaController (STELSELPEDIA) {
        var vm = this;

        vm.metaFields = [];

        STELSELPEDIA.DEFINITIONS[vm.definition].meta.forEach(function (field) {
            vm.metaFields.push({
                label: STELSELPEDIA.META[field].label,
                value: vm.apiData.results[field],
                type: STELSELPEDIA.META[field].type
            });
        });
    }
})();
