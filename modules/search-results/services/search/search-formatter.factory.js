(function () {
    'use strict';

    angular
        .module('dpSearchResults')
        .factory('searchFormatter', searchFormatterFactory);

    searchFormatterFactory.$inject = ['SEARCH_CONFIG'];

    function searchFormatterFactory (SEARCH_CONFIG) {
        return {
            formatCategories: formatCategories,
            formatCategory: formatCategory,
            formatLinks: formatLinks
        };

        function formatCategories (allSearchResults) {
            return allSearchResults
                .map(function (endpointSearchResults, index) {
                    return formatCategory(SEARCH_CONFIG.QUERY_ENDPOINTS[index].slug, endpointSearchResults);
                })
                // Remove 'empty' categories with no search results
                .filter(function (endpointSearchResults) {
                    return endpointSearchResults.count;
                });
        }

        function formatCategory (slug, endpointSearchResults) {
            var endpointConfig,
                links;

            endpointConfig = SEARCH_CONFIG.QUERY_ENDPOINTS.filter(function (endpoint) {
                return endpoint.slug === slug;
            })[0];

            links = angular.isObject(endpointSearchResults) && endpointSearchResults.results || [];

            return {
                label_singular: endpointConfig.label_singular,
                label_plural: endpointConfig.label_plural,
                slug: endpointConfig.slug,
                count: angular.isObject(endpointSearchResults) && endpointSearchResults.count || 0,
                results: formatLinks(links),
                useIndenting: false,
                next: angular.isObject(endpointSearchResults) &&
                endpointSearchResults._links &&
                endpointSearchResults._links.next.href || null
            };
        }

        function formatLinks (links) {
            return links.map(function (item) {
                return {
                    label: formatLabel(item),
                    hoofdadres: item.hoofdadres,
                    vbo_status: angular.isArray(item.vbo_status) ? item.vbo_status[0] : item.vbo_status,
                    endpoint: item._links.self.href,
                    subtype: item.subtype || null
                };
            });
        }

        function formatLabel (item) {
            let label = item._display;

            if (item.type === 'gebied') {
                label = item.naam;
            } else if (item.type === 'bouwblok') {
                label = item.code;
            }

            return label;
        }
    }
})();
