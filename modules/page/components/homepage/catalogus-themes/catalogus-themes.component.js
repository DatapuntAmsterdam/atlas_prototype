import ACTIONS from '../../../../../src/shared/actions';

(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpCatalogusThemes', {
            templateUrl: 'modules/page/components/homepage/catalogus-themes/catalogus-themes.html',
            controller: DpCatalogusThemes,
            controllerAs: 'vm'
        });

    DpCatalogusThemes.$inject = ['CATALOGUS_THEMES_CONFIG', 'store'];

    function DpCatalogusThemes (CATALOGUS_THEMES_CONFIG, store) {
        const vm = this;

        vm.onClick = (theme) => {
            store.dispatch({
                type: ACTIONS.APPLY_FILTERS,
                payload: {
                    groups: theme
                }
            });

            store.dispatch({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: 'dcatd',
                    view: 'CATALOG',
                    page: 1
                }
            });
        };

        vm.themes = angular.copy(CATALOGUS_THEMES_CONFIG);
        vm.themesPerColumn = Math.ceil(vm.themes.length / 2);
    }
})();
