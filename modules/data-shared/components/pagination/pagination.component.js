(function () {
    'use strict';

    angular
        .module('dpDataShared')
        .component('dpDataSharedPagination', {
            bindings: {
                updateAction: '@',
                currentPage: '<',
                numberOfPages: '<'
            },
            templateUrl: 'modules/data-shared/components/pagination/pagination.html',
            controller: DpDataSharedPaginationController,
            controllerAs: 'vm'
        });

    DpDataSharedPaginationController.$inject = ['store', 'ACTIONS'];

    function DpDataSharedPaginationController (store, ACTIONS) {
        var vm = this,
            isFirstPage,
            isLastPage;

        isFirstPage = vm.currentPage === 1;
        isLastPage = vm.currentPage === vm.numberOfPages;

        vm.showPagination = vm.numberOfPages > 1;

        if (vm.showPagination) {
            vm.firstPage = {
                label: 'Eerste',
                class_name: 'c-data-shared-pagination-link--first',
                page: 1,
                enabled: !isFirstPage
            };

            vm.previousPage = {
                label: 'Vorige',
                class_name: 'c-data-shared-pagination-link--previous',
                page: isFirstPage ? null : vm.currentPage - 1,
                enabled: !isFirstPage
            };

            vm.nextPage = {
                label: 'Volgende',
                class_name: 'c-data-shared-pagination-link--next',
                page: isLastPage ? null : vm.currentPage + 1,
                enabled: !isLastPage
            };

            vm.lastPage = {
                label: 'Laatste',
                class_name: 'c-data-shared-pagination-link--last',
                page: vm.numberOfPages,
                enabled: !isLastPage
            };
        }

        vm.goToPage = function (event) {
            event.preventDefault();

            if (angular.isNumber(vm.currentPage) && vm.currentPage >= 1 && vm.currentPage <= vm.numberOfPages) {
                store.dispatch({
                    type: vm.updateAction,
                    payload: vm.currentPage
                });
            }
        };
    }
})();
