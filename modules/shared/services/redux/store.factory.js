/**
 * @ngdoc service
 * @name dpshared.store
 * @link dpshared.store store
 * @description
 * The serivice used to store the application state
 */
(function () {
    angular
        .module('dpShared')
        .factory('store', storeFactory);

    storeFactory.$inject = ['applicationState'];

    function storeFactory (applicationState) {
        return applicationState.getStore();
    }
})();