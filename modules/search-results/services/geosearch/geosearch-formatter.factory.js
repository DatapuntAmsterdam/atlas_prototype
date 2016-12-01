(function () {
    angular
        .module('dpSearchResults')
        .factory('geosearchFormatter', geosearchFormatterFactory);

    geosearchFormatterFactory.$inject = ['SEARCH_CONFIG'];

    function geosearchFormatterFactory (SEARCH_CONFIG) {
        return {
            format: format
        };

        function format (allSearchResults) {
            var allFeaturesFlattened = allSearchResults
                .map(function (searchResult) {
                    return searchResult.features.map(function (feature) {
                        return feature.properties;
                    });
                })
                .reduce(function (previous, current) {
                    return previous.concat(current);
                }, []);

            return SEARCH_CONFIG.COORDINATES_HIERARCHY
                .map(function (rawCategory) {
                    var formattedCategory = {
                        slug: rawCategory.slug || null,
                        label_singular: rawCategory.label_singular,
                        label_plural: rawCategory.label_plural,
                        results: allFeaturesFlattened
                            .filter(function (feature) {
                                return rawCategory.features.indexOf(feature.type) !== -1;
                            })
                            .sort(function (featureA, featureB) {
                                var indexA,
                                    indexB;

                                indexA = rawCategory.features.indexOf(featureA.type);
                                indexB = rawCategory.features.indexOf(featureB.type);

                                return indexA - indexB;
                            })
                            .map(function (feature) {
                                var subtype,
                                    subtypeLabel;

                                if (feature.opr_type) {
                                    // Openbare ruimtes
                                    subtype = feature.opr_type.toLowerCase();
                                } else if (feature.type.match(/^gebieden\//)) {
                                    // Gebieden
                                    subtype = feature.type.replace(/^gebieden\//, '');
                                } else {
                                    subtype = null;
                                }

                                subtypeLabel = subtype;
                                if (subtype && rawCategory.subtypes) {
                                    subtypeLabel = rawCategory.subtypes[subtype] || subtype;
                                }

                                return {
                                    label: feature.display,
                                    subtype: subtype,
                                    subtypeLabel: subtypeLabel,
                                    endpoint: feature.uri
                                };
                            }),
                        useIndenting: false
                    };

                    formattedCategory.count = formattedCategory.results.length;

                    return formattedCategory;
                })
                .filter(function (category) {
                    // Remove empty categories
                    return category.count > 0;
                });
        }
    }
})();
