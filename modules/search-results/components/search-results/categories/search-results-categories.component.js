((() => {
    'use strict';

    angular
        .module('dpSearchResults')
        .component('dpSearchResultsCategories', {
            bindings: {
                categories: '='
            },
            templateUrl: 'modules/search-results/components/search-results/categories/search-results-categories.html',
            controller: DpSearchResultsCategoriesController,
            controllerAs: 'vm'
        });

    DpSearchResultsCategoriesController.$inject = [
        'user'
    ];

    function DpSearchResultsCategoriesController (user) {
        const vm = this;

        vm.meetsRequiredLevel = user.meetsRequiredLevel;
    }
}))();
