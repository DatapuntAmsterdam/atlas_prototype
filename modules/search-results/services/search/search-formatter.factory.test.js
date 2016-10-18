describe('The searchFormatter factory', function () {
    var searchFormatter,
        mockedInputCategories = [
            {
                count: 2,
                results: [
                    {
                        _display: 'FAKE_LINK_A',
                        _links: {
                            self: {
                                href: 'http://www.example.com/path/to/1'
                            }
                        }
                    }, {
                        _display: 'FAKE_LINK_B',
                        _links: {
                            self: {
                                href: 'http://www.example.com/path/to/2'
                            }
                        }
                    }],
                _links: {
                    next: {
                        href: null
                    }
                }
            }, {
                count: 6,
                results: [
                    {
                        _display: 'FAKE_LINK_1',
                        _links: {
                            self: {
                                href: 'http://www.example.com/path/to/101'
                            }
                        }
                    }, {
                        _display: 'FAKE_LINK_2',
                        _links: {
                            self: {
                                href: 'http://www.example.com/path/to/102'
                            }
                        }
                    }, {
                        _display: 'FAKE_LINK_3',
                        _links: {
                            self: {
                                href: 'http://www.example.com/path/to/103'
                            }
                        },
                        subtype: 'water'
                    }, {
                        _display: 'FAKE_LINK_4',
                        _links: {
                            self: {
                                href: 'http://www.example.com/path/to/104'
                            }
                        }
                    }, {
                        _display: 'FAKE_LINK_5',
                        _links: {
                            self: {
                                href: 'http://www.example.com/path/to/105'
                            }
                        }
                    }
                ],
                _links: {
                    next: {
                        href: 'path/to/meetbouten/?q=something&page=2'
                    }
                }
            }, [
                // Some endpoints return an empty array when there are no search results
            ], {
                // Others with an object with count set to 0
                count: 0,
                results: []
            }
        ],
        mockedInputLinks = [
            {
                _display: 'Linnaeusstraat 2',
                _links: {
                    self: {
                        href: 'http://www.example.com/path/to/123'
                    }
                }
            }, {
                _display: 'Linnaeusstraat',
                _links: {
                    self: {
                        href: 'http://www.example.com/path/to/124'
                    }
                },
                subtype: 'weg'
            }, {
                _display: 'Waterslootplas',
                _links: {
                    self: {
                        href: 'http://www.example.com/path/to/125'
                    }
                },
                subtype: 'water'
            }
        ];

    beforeEach(function () {
        angular.mock.module(
            'dpSearchResults',
            function ($provide) {
                $provide.constant('SEARCH_CONFIG', {
                    QUERY_ENDPOINTS: [
                        {
                            slug: 'adres',
                            label_singular: 'Adres',
                            label_plural: 'Adressen',
                            uri: 'path/to/adressen/'
                        }, {
                            slug: 'meetbouten',
                            label_singular: 'Meetbout',
                            label_plural: 'Meetbouten',
                            uri: 'path/to/meetbouten/'
                        }, {
                            slug: 'bouwblokken',
                            label_singular: 'Bouwblok',
                            label_plural: 'Bouwblokken',
                            uri: 'path/to/bouwbloken/'
                        }, {
                            slug: 'brk-object',
                            label_singular: 'Kadastraal object',
                            label_plural: 'Kadastrale objecten',
                            uri: 'path-to/brk-object/'
                        }
                    ]
                });
            }
        );

        angular.mock.inject(function (_searchFormatter_) {
            searchFormatter = _searchFormatter_;
        });
    });

    it('has a formatCategories function', function () {
        var output;

        output = searchFormatter.formatCategories(mockedInputCategories);

        expect(output).toEqual([
            {
                label_singular: 'Adres',
                label_plural: 'Adressen',
                slug: 'adres',
                count: 2,
                results: [
                    {
                        label: 'FAKE_LINK_A',
                        endpoint: 'http://www.example.com/path/to/1',
                        subtype: null
                    }, {
                        label: 'FAKE_LINK_B',
                        endpoint: 'http://www.example.com/path/to/2',
                        subtype: null
                    }
                ],
                useIndenting: false,
                next: null
            }, {
                label_singular: 'Meetbout',
                label_plural: 'Meetbouten',
                slug: 'meetbouten',
                count: 6,
                results: [
                    {
                        label: 'FAKE_LINK_1',
                        endpoint: 'http://www.example.com/path/to/101',
                        subtype: null
                    }, {
                        label: 'FAKE_LINK_2',
                        endpoint: 'http://www.example.com/path/to/102',
                        subtype: null
                    }, {
                        label: 'FAKE_LINK_3',
                        endpoint: 'http://www.example.com/path/to/103',
                        subtype: 'water'
                    }, {
                        label: 'FAKE_LINK_4',
                        endpoint: 'http://www.example.com/path/to/104',
                        subtype: null
                    }, {
                        label: 'FAKE_LINK_5',
                        endpoint: 'http://www.example.com/path/to/105',
                        subtype: null
                    }
                ],
                useIndenting: false,
                next: 'path/to/meetbouten/?q=something&page=2'
            }
        ]);
    });

    it('has a formatCategory function (one single category)', function () {
        var output;

        output = searchFormatter.formatCategory('adres', mockedInputCategories[0]);

        expect(output).toEqual({
            label_singular: 'Adres',
            label_plural: 'Adressen',
            slug: 'adres',
            count: 2,
            results: [
                {
                    label: 'FAKE_LINK_A',
                    endpoint: 'http://www.example.com/path/to/1',
                    subtype: null
                }, {
                    label: 'FAKE_LINK_B',
                    endpoint: 'http://www.example.com/path/to/2',
                    subtype: null
                }
            ],
            useIndenting: false,
            next: null
        });
    });

    it('has a formatLinks function', function () {
        var output = searchFormatter.formatLinks(mockedInputLinks);

        expect(output).toEqual([
            {
                label: 'Linnaeusstraat 2',
                endpoint: 'http://www.example.com/path/to/123',
                subtype: null
            }, {
                label: 'Linnaeusstraat',
                endpoint: 'http://www.example.com/path/to/124',
                subtype: 'weg'
            }, {
                label: 'Waterslootplas',
                endpoint: 'http://www.example.com/path/to/125',
                subtype: 'water'
            }
        ]);
    });
});
