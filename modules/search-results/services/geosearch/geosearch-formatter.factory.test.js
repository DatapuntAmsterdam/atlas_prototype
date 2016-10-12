describe('The geosearchFormatter factory', function () {
    var geosearchFormatter,
        rawSearchResults;

    beforeEach(function () {
        angular.mock.module(
            'atlasSearchResults',
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
                                'gebieden/stadsdeel',
                                'gebieden/bouwblok'
                            ]
                        }, {
                            label_singular: 'Meetbout',
                            label_plural: 'Meetbouten',
                            features: ['meetbouten/meetbout']
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
                            uri: 'https://api.datapunt.amsterdam.nl/meetbouten/meetbout/12981535/'
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
                            uri: 'https://api.datapunt.amsterdam.nl/gebieden/bouwblok/03630012096593/'
                        }
                    }, {
                        properties: {
                            display: 'Zuid',
                            id: '03630011872038',
                            type: 'gebieden/stadsdeel',
                            uri: 'https://api.datapunt.amsterdam.nl/gebieden/stadsdeel/03630011872038/'
                        }
                    }, {
                        properties: {
                            display: '03630013046846',
                            id: '03630013046846',
                            type: 'bag/pand',
                            uri: 'https://api.datapunt.amsterdam.nl/bag/pand/03630013046846/'
                        }
                    }, {
                        properties: {
                            display: 'Amstel',
                            id: '03630011950509',
                            opr_type: 'Water',
                            type: 'bag/openbareruimte',
                            uri: 'https://api.datapunt.amsterdam.nl/bag/openbareruimte/03630011950509/'
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
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/pand/03630013046846/'
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
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/openbareruimte/03630011950509/'
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
                        subtype: 'stadsdeel',
                        endpoint: 'https://api.datapunt.amsterdam.nl/gebieden/stadsdeel/03630011872038/'
                    }, {
                        label: 'AK47',
                        subtype: 'bouwblok',
                        endpoint: 'https://api.datapunt.amsterdam.nl/gebieden/bouwblok/03630012096593/'
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
                        endpoint: 'https://api.datapunt.amsterdam.nl/meetbouten/meetbout/12981535/'
                    }
                ],
                useIndenting: false
            }
        ]);
    });
});
