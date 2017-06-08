(function () {
    angular
        .module('dpSearchResults')
        .factory('uriStripper', uriStripperFactory);

    uriStripperFactory.$inject = ['sharedConfig'];

    function uriStripperFactory (sharedConfig) {
        return {
            stripUri,
            stripSelfLink
        };

        function stripUri (uri) {
            // remove first occurrence of API_ROOT
            return uri.replace(sharedConfig.API_ROOT, '');
        }

        function stripSelfLink (obj) {
            obj._links.self.href = stripUri(obj._links.self.href);
            return obj;
        }
    }
})();
