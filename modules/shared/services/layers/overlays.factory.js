((() => {
    'use strict';

    angular
        .module('dpShared')
        .factory('overlays', overlaysFactory);

    overlaysFactory.$inject = ['$rootScope', 'OVERLAYS', 'user'];

    function overlaysFactory ($rootScope, OVERLAYS, user) {
        const overlays = {
            SOURCES: {},
            HIERARCHY: []
        };

        setOverlays();  // Initialize overlays

        // Update overlays on any change in the authorization level of the user
        const unwatchAuthorizationLevel = $rootScope.$watch(() => user.getAuthorizationLevel(), setOverlays);
        $rootScope.$on('$destroy', unwatchAuthorizationLevel);  // for the weak of heart...

        return {
            get SOURCES () {return overlays.SOURCES;},
            get HIERARCHY () {return overlays.HIERARCHY;}
        };

        function setOverlays () {
            overlays.SOURCES = {};
            Object.keys(OVERLAYS.SOURCES)
                .filter(source => user.meetsRequiredLevel(OVERLAYS.SOURCES[source].authorizationLevel))
                .forEach(source => overlays.SOURCES[source] = OVERLAYS.SOURCES[source]);

            overlays.HIERARCHY = angular.copy(OVERLAYS.HIERARCHY)
                .map(hierarchy => {
                    hierarchy.overlays = hierarchy.overlays.filter(overlay => overlays.SOURCES[overlay]);
                    return hierarchy;
                })
                .filter(hierarchy => hierarchy.overlays.length > 0);
        }
    }
}))();
