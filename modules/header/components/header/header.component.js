(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpHeader', {
            templateUrl: 'modules/header/components/header/header.html',
            controller: DpHeaderController,
            controllerAs: 'vm',
            bindings: {
                isHomePage: '<',
                hasMaxWidth: '<'
            }
        });

    function DpHeaderController (store, dashboardColumns, HEADER) {
        const vm = this;

        vm.store = store;

        function setLayout () { // eslint-disable-line complexity
            const state = store.getState();

            vm.user = state.user;

            vm.headerSize = vm.isHomePage ? HEADER.SIZE.TALL : HEADER.SIZE.SHORT;

            vm.isPrintMode = state.ui.isPrintMode;
            vm.isEmbedPreview = state.ui.isEmbedPreview;
            vm.isEmbed = state.ui.isEmbed;
            vm.isPrintOrEmbedOrPreview = dashboardColumns.isPrintOrEmbedOrPreview(state);
        }

        vm.$onChanges = setLayout;
        store.subscribe(setLayout);
        setLayout();
    }

    DpHeaderController.$inject = ['store', 'dashboardColumns', 'HEADER'];
})();
