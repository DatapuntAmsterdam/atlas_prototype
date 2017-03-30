describe('The geosearchFormatter factory', function () {
    var geosearchFormatter,
        rawSearchResults;

    beforeEach(function () {
        angular.mock.module(
            'dpSearchResults',
            function ($provide) {
                $provide.constant('SEARCH_CONFIG', {
                    COORDINATES_HIERARCHY: [
                        {
                            slug: 'pand',
                            label_singular: 'Pand',
                            label_plural: 'Panden',
                            features: ['bag/pand']
                        }, {
                            label_singular: 'Openbare ruimte',
                            label_plural: 'Openbare ruimtes',
                            features: ['bag/openbareruimte']
                        }, {
                            label_singular: 'Gebied',
                            label_plural: 'Gebieden',
                            features: [
                                'gebieden/gebiedsgerichtwerken',
                                'gebieden/bouwblok'
                            ],
                            subtypes: {
                                gebiedsgerichtwerken: 'gebiedsgericht werken'
                            }
                        }, {
                            label_singular: 'Meetbout',
                            label_plural: 'Meetbouten',
                            features: ['meetbouten/meetbout']
                        }, {
                            slug: 'explosief',
                            label_singular: 'Explosief',
                            label_plural: 'Explosieven',
                            features: [
                                'bommenkaart/verdachtgebied',
                                'bommenkaart/bominslag',
                                'bommenkaart/uitgevoerdonderzoek',
                                'bommenkaart/gevrijwaardgebied'
                            ],
                            subtypes: {
                                bominslag: 'inslag',
                                gevrijwaardgebied: 'gevrijwaard gebied',
                                uitgevoerdonderzoek: 'reeds uitgevoerd CE onderzoek',
                                verdachtgebied: 'verdacht gebied'
                            }
                        }
                    ]
                });
            }
        );

        angular.mock.inject(function (_geosearchFormatter_) {
            geosearchFormatter = _geosearchFormatter_;
        });

        rawSearchResults = [
            {
                type: 'FeatureCollection',
                features: [
                    {
                        properties: {
                            display: '12981535',
                            id: '12981535',
                            type: 'meetbouten/meetbout',
                            uri: 'https://api.data.amsterdam.nl/meetbouten/meetbout/12981535/'
                        }
                    }
                ]
            },
            {
                type: 'FeatureCollection',
                features: [
                    {
                        properties: {
                            display: 'AK47',
                            id: '03630012096593',
                            type: 'gebieden/bouwblok',
                            uri: 'https://api.data.amsterdam.nl/gebieden/bouwblok/03630012096593/'
                        }
                    }, {
                        properties: {
                            display: 'Zuid',
                            id: '03630011872038',
                            type: 'gebieden/gebiedsgerichtwerken',
                            uri: 'https://api.data.amsterdam.nl/gebieden/gebiedsgerichtwerken/03630011872038/'
                        }
                    }, {
                        properties: {
                            display: '03630013046846',
                            id: '03630013046846',
                            type: 'bag/pand',
                            uri: 'https://api.data.amsterdam.nl/bag/pand/03630013046846/'
                        }
                    }, {
                        properties: {
                            display: 'Amstel',
                            id: '03630011950509',
                            opr_type: 'Water',
                            type: 'bag/openbareruimte',
                            uri: 'https://api.data.amsterdam.nl/bag/openbareruimte/03630011950509/'
                        }
                    }
                ]
            },
            {
                type: 'FeatureCollection',
                features: [
                    {
                        properties: {
                            display: 'Bommending #1',
                            type: 'bommenkaart/verdachtgebied',
                            uri: 'https://api.data.amsterdam.nl/bommenkaart/verdachtgebied/123456/'
                        }
                    }, {
                        properties: {
                            display: 'Bommending #2',
                            type: 'bommenkaart/uitgevoerdonderzoek',
                            uri: 'https://api.data.amsterdam.nl/bommenkaart/uitgevoerdonderzoek/123456/'
                        }
                    }, {
                        properties: {
                            display: 'Bommending #3',
                            type: 'bommenkaart/gevrijwaardgebied',
                            uri: 'https://api.data.amsterdam.nl/bommenkaart/gevrijwaardgebied/123456/'
                        }
                    }
                ]
            },
            {
                type: 'FeatureCollection',
                features: [
                    {
                        properties: {
                            display: 'Bommending #4',
                            type: 'bommenkaart/bominslag',
                            uri: 'https://api.data.amsterdam.nl/bommenkaart/bominslag/123456/'
                        }
                    }
                ]
            }
        ];
    });

    it('formats and sorts the raw API data', function () {
        expect(geosearchFormatter.format(rawSearchResults)).toEqual([
            {
                slug: 'pand',
                label_singular: 'Pand',
                label_plural: 'Panden',
                count: 1,
                results: [
                    {
                        label: '03630013046846',
                        subtype: null,
                        subtypeLabel: null,
                        endpoint: 'https://api.data.amsterdam.nl/bag/pand/03630013046846/'
                    }
                ],
                useIndenting: false
            }, {
                slug: null,
                label_singular: 'Openbare ruimte',
                label_plural: 'Openbare ruimtes',
                count: 1,
                results: [
                    {
                        label: 'Amstel',
                        subtype: 'water', // Converted to lowercase
                        subtypeLabel: 'water', // Converted to lowercase
                        endpoint: 'https://api.data.amsterdam.nl/bag/openbareruimte/03630011950509/'
                    }
                ],
                useIndenting: false
            }, {
                slug: null,
                label_singular: 'Gebied',
                label_plural: 'Gebieden',
                count: 2,
                // These two results are sorted by the geosearchFormatter, the API results are in a different order
                results: [
                    {
                        label: 'Zuid',
                        subtype: 'gebiedsgerichtwerken',
                        subtypeLabel: 'gebiedsgericht werken',
                        endpoint: 'https://api.data.amsterdam.nl/gebieden/gebiedsgerichtwerken/03630011872038/'
                    }, {
                        label: 'AK47',
                        subtype: 'bouwblok',
                        subtypeLabel: 'bouwblok',
                        endpoint: 'https://api.data.amsterdam.nl/gebieden/bouwblok/03630012096593/'
                    }
                ],
                useIndenting: false
            }, {
                slug: null,
                label_singular: 'Meetbout',
                label_plural: 'Meetbouten',
                count: 1,
                results: [
                    {
                        label: '12981535',
                        subtype: null,
                        subtypeLabel: null,
                        endpoint: 'https://api.data.amsterdam.nl/meetbouten/meetbout/12981535/'
                    }
                ],
                useIndenting: false
            }, {
                slug: 'explosief',
                label_singular: 'Explosief',
                label_plural: 'Explosieven',
                count: 4,
                results: [
                    {
                        label: 'Bommending #1',
                        subtype: 'verdachtgebied',
                        subtypeLabel: 'verdacht gebied',
                        endpoint: 'https://api.data.amsterdam.nl/bommenkaart/verdachtgebied/123456/'
                    }, {
                        label: 'Bommending #4',
                        subtype: 'bominslag',
                        subtypeLabel: 'inslag',
                        endpoint: 'https://api.data.amsterdam.nl/bommenkaart/bominslag/123456/'
                    }, {
                        label: 'Bommending #2',
                        subtype: 'uitgevoerdonderzoek',
                        subtypeLabel: 'reeds uitgevoerd CE onderzoek',
                        endpoint: 'https://api.data.amsterdam.nl/bommenkaart/uitgevoerdonderzoek/123456/'
                    }, {
                        label: 'Bommending #3',
                        subtype: 'gevrijwaardgebied',
                        subtypeLabel: 'gevrijwaard gebied',
                        endpoint: 'https://api.data.amsterdam.nl/bommenkaart/gevrijwaardgebied/123456/'
                    }
                ],
                useIndenting: false
            }
        ]);
    });
});
