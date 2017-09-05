(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('clusteredMarkersConfig', clusteredMarkersConfig);

    clusteredMarkersConfig.$inject = ['L'];

    function clusteredMarkersConfig (L) {
        return {
            chunkedLoading: true,
            maxClusterRadius: 50,
            disableClusteringAtZoom: 16,
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            iconCreateFunction: function (cluster) {
                return L.divIcon({
                    html: '<div class="o-highlight-cluster__text">' + cluster.getChildCount() + '</div>',
                    className: 'o-highlight-cluster',
                    iconSize: L.point(39, 39),
                    iconAnchor: L.point(19, 19)
                });
            }
        };
    }
})();
