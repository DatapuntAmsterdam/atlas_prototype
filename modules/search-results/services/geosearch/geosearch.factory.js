(function () {
    angular
        .module('dpSearchResults')
        .factory('geosearch', geosearchFactory);

    geosearchFactory.$inject = ['$q', 'SEARCH_CONFIG', 'api', 'geosearchFormatter', 'searchFormatter'];

    function geosearchFactory ($q, SEARCH_CONFIG, api, geosearchFormatter, searchFormatter) {
        return {
            search: searchFeatures
        };

        function searchFeatures (location) {
            var allRequests = [];

            SEARCH_CONFIG.COORDINATES_ENDPOINTS.forEach(function (endpoint) {
                var request,
                    searchParams = {
                        lat: location[0],
                        lon: location[1]
                    };

                if (angular.isNumber(endpoint.radius)) {
                    searchParams.radius = endpoint.radius;
                }

                request = api.getByUri(endpoint.uri, searchParams);

                allRequests.push(request);
            });

            return $q.all(allRequests)
                .then(geosearchFormatter.format)
                .then(getVerblijfsobjecten);
        }

        function getVerblijfsobjecten (geosearchResults) {
            var q,
                pandCategoryIndex,
                pandEndpoint;

            q = $q.defer();

            geosearchResults.forEach(function (category, index) {
                if (category.slug === 'pand') {
                    pandCategoryIndex = index;
                    pandEndpoint = category.results[0].endpoint;
                }
            });

            if (angular.isDefined(pandEndpoint)) {
                api.getByUrl(pandEndpoint).then(function (pand) {
                    api.getByUrl(pand.verblijfsobjecten.href).then(function (verblijfsobjecten) {
                        var geosearchResultsCopy = angular.copy(geosearchResults),
                            formattedVerblijfsobjecten;

                        if (verblijfsobjecten.count) {
                            formattedVerblijfsobjecten = searchFormatter.formatCategory('adres', verblijfsobjecten);

                            formattedVerblijfsobjecten.useIndenting = true;
                            formattedVerblijfsobjecten.more = {
                                label: 'Bekijk alle ' + formattedVerblijfsobjecten.count + ' adressen binnen dit pand',
                                endpoint: pand._links.self.href
                            };

                            // Splice modifies the existing Array, we don't want our input to change hence the copy
                            geosearchResultsCopy.splice(
                                pandCategoryIndex + 1,
                                0,
                                formattedVerblijfsobjecten
                            );
                        }

                        q.resolve(geosearchResultsCopy);
                    });
                });
            } else {
                q.resolve(geosearchResults);
            }

            return q.promise;
        }
    }
})();
