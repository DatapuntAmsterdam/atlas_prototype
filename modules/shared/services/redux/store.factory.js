(function () {
    angular
        .module('dpShared')
        .factory('store', storeFactory);

    storeFactory.$inject = ['applicationState'];

    function storeFactory (applicationState) {
        return applicationState.getStore();
    }
})();
