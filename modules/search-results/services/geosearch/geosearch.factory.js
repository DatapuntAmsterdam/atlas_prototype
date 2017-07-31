((() => {
    angular
        .module('dpSearchResults')
        .factory('geosearch', geosearchFactory);

    geosearchFactory.$inject = ['$q', 'SEARCH_CONFIG', 'api', 'geosearchFormatter', 'searchFormatter', 'user'];

    function geosearchFactory ($q, SEARCH_CONFIG, api, geosearchFormatter, searchFormatter, user) {
        return {
            search: searchFeatures
        };

        function searchFeatures (location) {
            var allRequests = [];

            SEARCH_CONFIG.COORDINATES_ENDPOINTS.forEach(endpoint => {
                var request,
                    searchParams = {
                        lat: location[0],
                        lon: location[1]
                    };

                if (angular.isNumber(endpoint.radius)) {
                    searchParams.radius = endpoint.radius;
                }

                request = api.getByUri(endpoint.uri, searchParams).then(
                    data => data,
                    () => { return { features: [] }; });    // empty features on failure op api call

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

            if (plaatsEndpoint && user.meetsRequiredLevel('EMPLOYEE')) {
                // Only fetching 'vestigingen' for a standplaats/ligplaats, so
                // we check for employee status here already
                api.getByUrl(plaatsEndpoint).then(processPlaatsData);
            } else if (pandEndpoint) {
                api.getByUrl(pandEndpoint).then(processPandData);
            } else {
                q.resolve(geosearchResults);
            }

            return q.promise;

            function processPandData (pand) {
                const vestigingenUri = `handelsregister/vestiging/?pand=${pand.pandidentificatie}`;

                const requests = [
                    api.getByUrl(pand._adressen.href).then(formatVerblijfsobjecten)
                ];

                if (user.meetsRequiredLevel('EMPLOYEE')) {
                    requests.push(api.getByUri(vestigingenUri).then(formatVestigingen));
                }

                $q.all(requests).then(combineResults);

                function formatVerblijfsobjecten (objecten) {
                    // In verblijfsobjecten the status field is really a vbo_status field
                    // Rename this field to allow for tranparant processing of the search results
                    objecten.results.forEach(result => result.vbo_status = result.vbo_status || result.status);
                    const formatted = (objecten && objecten.count)
                            ? searchFormatter.formatCategory('adres', objecten) : null,
                        extended = formatted ? angular.extend(formatted, {
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
                            authLevel: 'EMPLOYEE',
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
                        geosearchResultsCopy[pandCategoryIndex].subResults = filteredResults;
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
            const plaatsCategories = geosearchResults.filter(
                    category => ['standplaats', 'ligplaats'].indexOf(category.slug) > -1),
                plaatsCategory = plaatsCategories.length ? plaatsCategories[0] : null,
                plaatsCategoryIndex = plaatsCategory ? geosearchResults.indexOf(plaatsCategory) : null,
                plaatsEndpoint = plaatsCategory ? plaatsCategory.results[0].endpoint : null;

            return [plaatsCategoryIndex, plaatsEndpoint];
        }
    }
}))();
