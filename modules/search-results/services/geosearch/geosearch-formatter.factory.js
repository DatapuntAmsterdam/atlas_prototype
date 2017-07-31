((() => {
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
                .map(searchResult => searchResult.features.map(feature => feature.properties))
                .reduce((previous, current) => previous.concat(current), []);

            return SEARCH_CONFIG.COORDINATES_HIERARCHY
                .map(rawCategory => {
                    var formattedCategory = {
                        slug: rawCategory.slug || null,
                        label_singular: rawCategory.label_singular,
                        label_plural: rawCategory.label_plural,
                        results: allFeaturesFlattened
                            .filter(feature => rawCategory.features.indexOf(feature.type) !== -1)
                            .sort((featureA, featureB) => {
                                var indexA,
                                    indexB;

                                indexA = rawCategory.features.indexOf(featureA.type);
                                indexB = rawCategory.features.indexOf(featureB.type);

                                return indexA - indexB;
                            })
                            .map(feature => {
                                let subtype = null,
                                    subtypeLabel;

                                if (feature.opr_type) {
                                    // Openbare ruimtes
                                    subtype = feature.opr_type.toLowerCase();
                                } else {
                                    ['gebieden', 'bommenkaart'].forEach((category) => {
                                        const regex = new RegExp('^' + category + '/');

                                        if (feature.type.match(regex)) {
                                            subtype = feature.type.replace(regex, '');
                                        }
                                    });
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
                .filter(category => // Remove empty categories
            category.count > 0);
        }
    }
}))();
