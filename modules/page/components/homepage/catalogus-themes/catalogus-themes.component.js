import { routing } from '../../../../../src/app/routes';

(function () {
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

        vm.themes = CATALOGUS_THEMES_CONFIG.map(theme => {
            const linkTo = {
                type: routing.catalogus.type,
                query: {
                    filter_theme: theme.slug
                }
            };
            return {
                ...theme,
                linkTo
            };
        });

        vm.themesPerColumn = Math.ceil(vm.themes.length / 2);
    }
})();
