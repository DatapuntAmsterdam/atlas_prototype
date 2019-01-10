import {
    preserveQuery,
    toDatasetsWithFilter
} from '../../../../src/store/redux-first-router/actions';
import PARAMETERS from '../../../../src/store/parameters';

(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpCatalogusThemes', {
            templateUrl: 'modules/page/components/catalogus-themes/catalogus-themes.html',
            controller: DpCatalogusThemes,
            controllerAs: 'vm'
        });

    DpCatalogusThemes.$inject = ['CATALOGUS_THEMES_CONFIG'];

    function DpCatalogusThemes (CATALOGUS_THEMES_CONFIG) {
        const vm = this;

        vm.themes = CATALOGUS_THEMES_CONFIG.map(theme => {
            const linkTo = preserveQuery(toDatasetsWithFilter(), {
                // eslint-disable-next-line angular/json-functions
                [PARAMETERS.FILTERS]: { groups: theme.slug }
            });
            return {
                ...theme,
                linkTo
            };
        });

        vm.themesPerColumn = Math.ceil(vm.themes.length / 2);
    }
})();
