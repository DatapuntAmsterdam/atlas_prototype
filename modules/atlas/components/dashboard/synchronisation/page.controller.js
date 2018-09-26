import PAGES from '../../../../../src/pages';

(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('PageController', PageController);

    PageController.$inject = ['store'];

    function PageController (store) {
        const vm = this;

        store.subscribe(update);
        update();

        function update () { // eslint-disable-line complexity
            var state = store.getState();

            // TODO refactor, get rid of page reducer, reducer is doing view logic
            // vm.pageName = state.page.name;
            // vm.pageType = state.page.type;
            // vm.pageItem = state.page.item;

            delete vm.pageName;
            delete vm.pageType;
            delete vm.pageItem;

            switch (state.ui.page) {
                case PAGES.HOME:
                    vm.pageName = 'home';
                    break;
                case PAGES.NIEUWS:
                    vm.pageName = 'content-detail';
                    vm.pageType = 'news';
                    vm.item = 'item0';
                    break;
                case PAGES.HELP:
                    vm.pageName = 'content-overzicht';
                    vm.pageType = 'help';
                    break;
                case PAGES.PROCLAIMER:
                    vm.pageName = 'content-overzicht';
                    vm.pageType = 'proclaimer';
                    break;

                case PAGES.BEDIENING:
                    vm.pageName = 'content-overzicht';
                    vm.pageType = 'snelwegwijs';
                    break;
                case PAGES.GEGEVENS:
                    vm.pageName = 'content-overzicht';
                    vm.pageType = 'info';
                    break;
                case PAGES.OVER_API:
                    vm.pageName = 'content-overzicht';
                    vm.pageType = 'apis';
                    break;
                case PAGES.PRIVACY_BEVEILIGING:
                    vm.pageName = 'content-detail';
                    vm.pageType = 'beleid';
                    vm.pageItem = 'item0';
                    break;
                case PAGES.BESCHIKBAAR_KWALITEIT:
                    vm.pageName = 'content-detail';
                    vm.pageType = 'beleid';
                    vm.pageItem = 'item1';
                    break;
                case PAGES.BEHEER_WERKWIJZE:
                    vm.pageName = 'content-detail';
                    vm.pageType = 'beleid';
                    vm.pageItem = 'item2';
                    break;
                case PAGES.STATISTIEKEN:
                    vm.pageName = 'content-overzicht';
                    vm.pageType = 'statistieken';
                    break;
            }
        }
    }
})();
