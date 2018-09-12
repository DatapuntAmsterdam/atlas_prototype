import { switchPage } from '../../../../../src/shared/ducks/ui/ui';
import PAGES from '../../../../../src/pages';
import ACTIONS from '../../../../../src/shared/actions';

(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionToggleViewButton', {
            bindings: {
                view: '<'
            },
            templateUrl: 'modules/data-selection/components/header/toggle-view-button/toggle-view-button.html',
            controller: DpToggleViewButtonController,
            controllerAs: 'vm'
        });

    DpToggleViewButtonController.$inject = ['$scope', 'store'];

    function DpToggleViewButtonController ($scope, store) {
        const vm = this;

        vm.onClick = () => {
            store.dispatch({
                type: ACTIONS.SET_DATA_SELECTION_VIEW,
                payload: vm.targetView
            });
            if (vm.targetView === 'LIST') {
                store.dispatch(switchPage(PAGES.KAART_ADRESSSEN));
            } else {
                store.dispatch(switchPage(PAGES.ADRESSEN));
            }
        };

        $scope.$watch('vm.view', function () {
            if (vm.view === 'TABLE') {
                vm.targetView = 'LIST';
                vm.targetLabel = 'Kaart weergeven';
                vm.targetHover = 'Resultaten op de kaart weergeven';
            } else {
                vm.targetView = 'TABLE';
                vm.targetLabel = 'Tabel weergeven';
                vm.targetHover = 'Resultaten in tabel weergeven';
            }
        });
    }
})();
