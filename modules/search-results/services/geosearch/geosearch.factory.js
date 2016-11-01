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
                .then(getRelatedObjects);
        }

        function getRelatedObjects (geosearchResults) {
            const q = $q.defer(),
                [pandCategoryIndex, pandEndpoint] = getPandData(geosearchResults),
                [plaatsCategoryIndex, plaatsEndpoint] = getPlaatsData(geosearchResults);

            if (plaatsEndpoint) {
                api.getByUrl(plaatsEndpoint).then(processPlaatsData);
            } else if (pandEndpoint) {
                api.getByUrl(pandEndpoint).then(processPandData);
            } else {
                q.resolve(geosearchResults);
            }

            return q.promise;

            function processPandData (pand) {
                const vestigingenUri = `handelsregister/vestiging/?pand=${pand.pandidentificatie}`;

                $q.all([
                    api.getByUrl(pand.verblijfsobjecten.href).then(formatVerblijfsobjecten),
                    api.getByUri(vestigingenUri).then(formatVestigingen)
                ]).then(combineResults);

                function formatVerblijfsobjecten (objecten) {
                    const formatted = (objecten && objecten.count)
                            ? searchFormatter.formatCategory('adres', objecten) : null,
                        extended = formatted ? angular.extend(formatted, {
                            useIndenting: true,
                            more: {
                                label: `Bekijk alle ${formatted.count} adressen binnen dit pand`,
                                endpoint: pand._links.self.href
                            }
                        }) : null;

                    return extended;
                }

                function formatVestigingen (vestigingen) {
                    const formatted = (vestigingen && vestigingen.count)
                            ? searchFormatter.formatCategory('vestiging', vestigingen) : null,
                        extended = formatted ? angular.extend(formatted, {
                            useIndenting: true,
                            more: {
                                label: `Bekijk alle ${formatted.count} vestigingen binnen dit pand`,
                                endpoint: pand._links.self.href
                            }
                        }) : null;

                    return extended;
                }

                function combineResults (results) {
                    const geosearchResultsCopy = angular.copy(geosearchResults),
                        filteredResults = results.filter(angular.identity);

                    if (filteredResults.length) {
                        // Splice modifies the existing Array, we don't want our input to change hence the copy
                        geosearchResultsCopy.splice(pandCategoryIndex + 1, 0, ...filteredResults);
                    }

                    q.resolve(geosearchResultsCopy);
                }
            }

            function processPlaatsData (plaats) {
                const vestigingenUri = `handelsregister/vestiging/?nummeraanduiding=${plaats.hoofdadres.landelijk_id}`;

                api.getByUri(vestigingenUri).then(formatVestigingen);

                function formatVestigingen (vestigingen) {
                    const formatted = (vestigingen && vestigingen.count)
                            ? searchFormatter.formatCategory('vestiging', vestigingen) : null,
                        labelLigplaats = plaats.ligplaatsidentificatie ? ' binnen deze ligplaats' : null,
                        labelStandplaats = plaats.standplaatsidentificatie ? ' binnen deze standplaats' : null,
                        label = labelLigplaats ? labelLigplaats : labelStandplaats ? labelStandplaats : '',
                        extended = formatted ? angular.extend(formatted, {
                            more: {
                                label: `Bekijk alle ${formatted.count} vestigingen` + label,
                                endpoint: plaats._links.self.href
                            }
                        }) : null,
                        geosearchResultsCopy = angular.copy(geosearchResults);

                    if (extended) {
                        // Splice modifies the existing Array, we don't want our input to change hence the copy
                        geosearchResultsCopy.splice(plaatsCategoryIndex + 1, 0, extended);
                    }

                    q.resolve(geosearchResultsCopy);
                }
            }
        }

        function getPandData (geosearchResults) {
            const pandCategories = geosearchResults.filter(category => category.slug === 'pand'),
                pandCategory = pandCategories.length ? pandCategories[0] : null,
                pandCategoryIndex = pandCategory ? geosearchResults.indexOf(pandCategory) : null,
                pandEndpoint = pandCategory ? pandCategory.results[0].endpoint : null;

            return [pandCategoryIndex, pandEndpoint];
        }

        function getPlaatsData (geosearchResults) {
            const plaatsCategories = geosearchResults.filter(category => category.slug === 'plaats'),
                plaatsCategory = plaatsCategories.length ? plaatsCategories[0] : null,
                plaatsCategoryIndex = plaatsCategory ? geosearchResults.indexOf(plaatsCategory) : null,
                plaatsEndpoint = plaatsCategory ? plaatsCategory.results[0].endpoint : null;

            return [plaatsCategoryIndex, plaatsEndpoint];
        }
    }
})();
