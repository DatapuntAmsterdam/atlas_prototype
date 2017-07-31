((() => {
    'use strict';

    angular
        .module('dpPage')
        .component('dpCatalogusThemes', {
            templateUrl: 'modules/page/components/homepage/catalogus-themes/catalogus-themes.html',
            controller: DpCatalogusThemes,
            controllerAs: 'vm'
        });

    DpCatalogusThemes.$inject = ['CATALOGUS_THEMES_CONFIG'];

    function DpCatalogusThemes (CATALOGUS_THEMES_CONFIG) {
        const vm = this;

        vm.themes = angular.copy(CATALOGUS_THEMES_CONFIG);
        vm.themesPerColumn = Math.ceil(vm.themes.length / 3);
    }
}))();
