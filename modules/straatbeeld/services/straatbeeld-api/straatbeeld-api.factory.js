import {
    getImageDataById,
    getImageDataByLocation
} from '../../../../src/shared/services/panorama-api/panorama-api';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('straatbeeldApi', straatbeeldApiFactory);

    straatbeeldApiFactory.$inject = ['STRAATBEELD_CONFIG'];

    function straatbeeldApiFactory (STRAATBEELD_CONFIG) {
        function getLocationHistoryParams (location, history) {
            const yearTypeMission = (history && history.year)
                ? `&mission_year=${history.year}&mission_type=${history.missionType}`
                : '';
            const newestInRange = 'newest_in_range=true';
            const pageSize = 'page_size=1';

            return {
                locationRange: (location)
                    ? `near=${location[1]},${location[0]}&srid=${STRAATBEELD_CONFIG.SRID}&${pageSize}` : '',
                newestInRange,
                standardRadius: `radius=${STRAATBEELD_CONFIG.MAX_RADIUS}`,
                largeRadius: `radius=${STRAATBEELD_CONFIG.LARGE_RADIUS}`,
                yearTypeMission,
                adjacenciesParams: `${newestInRange}${yearTypeMission}`
            };
        }

        return {
            getImageDataById,
            getImageDataByLocation,
            getLocationHistoryParams
        };

        // function getImageDataByLocation (location, history) {
        //     if (!angular.isArray(location)) {
        //         return null;
        //     }
        //
        //     const q = $q.defer();
        //     cancel = $q.defer();
        //
        //     const {
        //       adjacenciesParams,
        //       largeRadius,
        //       locationRange,
        //       newestInRange,
        //       standardRadius,
        //       yearTypeMission
        //     } = getLocationHistoryParams(location, history);
        //     const getLocationUrl = `${sharedConfig.API_ROOT}${prefix}/?${locationRange}${yearTypeMission}`;
        //     const limitResults = 'limit_results=1';
        //
        //     api.getByUrl(
        //       `${getLocationUrl}&${standardRadius}&${newestInRange}&${limitResults}`, undefined, cancel
        //     )
        //         .then((json) => json._embedded.panoramas[0])
        //         .then((data) => {
        //             if (data) {
        //                 // we found a pano nearby go to it
        //                 q.resolve(
        //                     getAdjaciencies(data._links.adjacencies.href, adjacenciesParams)
        //                 );
        //             } else {
        //                 // there is no pano nearby search with a large radius and go to it
        //                 api.getByUrl(`${getLocationUrl}&${largeRadius}&${limitResults}`, undefined, cancel)
        //                     .then((json) => json._embedded.panoramas[0])
        //                     .then((pano) => {
        //                         q.resolve(
        //                             getAdjaciencies(pano._links.adjacencies.href, adjacenciesParams)
        //                         );
        //                     });
        //             }
        //         })
        //         .finally(() => cancel = null);
        //
        //     return q.promise;
        // }
        //
        // function getAdjaciencies (url, params) {
        //     const getAdjacenciesUrl = `${url}?${params}`;
        //     return getStraatbeeld(getAdjacenciesUrl);
        // }
        //
        // function getImageDataById (id, history) {
        //     const { adjacenciesParams } = getLocationHistoryParams(null, history);
        //
        //     return getStraatbeeld(
        //         `${sharedConfig.API_ROOT}${prefix}/${id}/${suffix}/?${adjacenciesParams}`
        //     );
        // }
        //
        // function getStraatbeeld (url) {
        //     if (cancel) {
        //         // Cancel any outstanding requests
        //         // console.log('cancel call: ', url);
        //         cancel.resolve();
        //     }
        //
        //     cancel = $q.defer();
        //     return api.getByUrl(url, undefined, cancel)
        //         .then((json) => json._embedded.adjacencies)
        //         .then(imageData)
        //         .finally(() => cancel = null);
        // }
        //
        // function imageData (response) {
        //     const panorama = response && response[0];
        //     const adjacencies = response && response.filter((adjacency) => adjacency !== panorama);
        //
        //     const formattedGeometry = {
        //         coordinates: [
        //             panorama.geometry.coordinates[1],
        //             panorama.geometry.coordinates[0]
        //         ],
        //         type: panorama.geometry.type
        //     };
        //
        //     return {
        //         date: new Date(panorama.timestamp),
        //         id: panorama.pano_id,
        //         hotspots: adjacencies.map(function (adjacency) {
        //             return {
        //                 id: adjacency.pano_id,
        //                 heading: adjacency.direction,
        //                 distance: adjacency.distance,
        //                 year: adjacency.mission_year
        //             };
        //         }),
        //         location: geojson.getCenter(formattedGeometry),
        //         image: {
        //             baseurl: panorama.cubic_img_baseurl,
        //             pattern: panorama.cubic_img_pattern,
        //             preview: panorama._links.cubic_img_preview.href
        //         }
        //     };
        // }
    }
})();
