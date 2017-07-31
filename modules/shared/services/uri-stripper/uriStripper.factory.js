((() => {
    angular
        .module('dpShared')
        .factory('uriStripper', uriStripperFactory);

    uriStripperFactory.$inject = ['sharedConfig'];

    function uriStripperFactory (sharedConfig) {
        return {
            stripDomain
        };

        function stripDomain (uri) {
            // remove first occurrence of API_ROOT
            return uri.replace(sharedConfig.API_ROOT, '');
        }
    }
}))();
