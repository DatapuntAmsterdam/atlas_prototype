(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('earthmine', earthmine);

    earthmine.$inject = ['$http', 'straatbeeldConfig', 'earthmineDataFormatter'];

    function earthmine ($http, straatbeeldConfig, earthmineDataFormatter) {
        return {
            getImageDataById: getImageDataById,
            getImageDataByCoordinates: getImageDataByCoordinates,
            getImageSourceUrl: getImageSourceUrl
        };

        function getImageDataById (id) {
            return getImageData({
                id: id
            });
        }

        function getImageDataByCoordinates (latitude, longitude) {
            return getImageData({
                lat: latitude,
                lon: longitude
            });
        }

        function getImageData (searchParams) {
            return $http({
                method: 'GET',
                url: straatbeeldConfig.DATA_ENDPOINT,
                params: searchParams
            }).then(function (response) {
                return earthmineDataFormatter.formatPanoramaState(response.data);
            });
        }

        function getImageSourceUrl (sceneId) {
            return straatbeeldConfig.TILE_ENDPOINT + '?id=' + sceneId + '&f={f}&z={z}&x={x}&y={y}';
        }
    }
})(); 