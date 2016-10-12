describe('The search factory', function () {
    var $q,
        $rootScope,
        search,
        api,
        searchFormatter;

    beforeEach(function () {
        angular.mock.module(
            'atlasSearchResults',
            {
                api: {
                    getByUri: function () {
                        var q = $q.defer();

                        q.resolve('FAKE_RAW_RESULTS');

                        return q.promise;
                    },
                    getByUrl: function (url) {
                        var q = $q.defer(),
                            results,
                            nextUrl;

                        if (url === 'http://some-domain/path/to/slug/?q=waterloo&page=2&page_size=5') {
                            nextUrl = 'http://some-domain/path/to/slug/?q=waterloo&page=3&page_size=5';
                            results = [
                                'FAKE_LINK_F',
                                'FAKE_LINK_G',
                                'FAKE_LINK_H',
                                'FAKE_LINK_I',
                                'FAKE_LINK_J'
                            ];
                        } else if (url === 'http://some-domain/path/to/slug/?q=waterloo&page=3&page_size=5') {
                            nextUrl = null;
                            results = [
                                'FAKE_LINK_K'
                            ];
                        }

                        q.resolve({
                            _links: {
                                next: {
                                    href: nextUrl
                                }
                            },
                            count: 11,
                            results: results
                        });

                        return q.promise;
                    }
                },
                searchFormatter: {
                    formatCategories: function () {
                        return 'FAKE_FORMATTED_CATEGORIES_RESULTS';
                    },
                    formatCategory: function () {
                        return 'FAKE_FORMATTED_CATEGORY_RESULT';
                    },
                    formatLinks: function (links) {
                        if (links[0] === 'FAKE_LINK_F') {
                            return [
                                'FAKE_FORMATTED_LINK_F',
                                'FAKE_FORMATTED_LINK_G',
                                'FAKE_FORMATTED_LINK_H',
                                'FAKE_FORMATTED_LINK_I',
                                'FAKE_FORMATTED_LINK_J'
                            ];
                        } else {
                            return ['FAKE_FORMATTED_LINK_K'];
                        }
                    }
                }
            },
            function ($provide) {
                $provide.constant('SEARCH_CONFIG', {
                    QUERY_ENDPOINTS: [
                        {
                            slug: 'adres',
                            label_singular: 'Adres',
                            label_plural: 'Adressen',
                            uri: 'path/to/adres/'
                        }, {
                            slug: 'openbare_ruimte',
                            label_singular: 'Openbare ruimte',
                            label_plural: 'Openbare ruimtes',
                            uri: 'path/to/openbare_ruimte/'
                        }
                    ]
                });
            }
        );

        angular.mock.inject(function (_$q_, _$rootScope_, _search_, _api_, _searchFormatter_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            search = _search_;
            api = _api_;
            searchFormatter = _searchFormatter_;
        });

        spyOn(api, 'getByUri').and.callThrough();
        spyOn(searchFormatter, 'formatCategories').and.callThrough();
        spyOn(searchFormatter, 'formatCategory').and.callThrough();
        spyOn(searchFormatter, 'formatLinks').and.callThrough();
    });

    it('can retrieve formatted search results for all categories based on a query', function () {
        var searchResults;

        search.search('Waterlooplein').then(function (_searchResults_) {
            searchResults = _searchResults_;
        });

        $rootScope.$apply();

        // There have been 2 API calls
        expect(api.getByUri).toHaveBeenCalledTimes(2);
        expect(api.getByUri).toHaveBeenCalledWith('path/to/adres/', {q: 'Waterlooplein'});
        expect(api.getByUri).toHaveBeenCalledWith('path/to/openbare_ruimte/', {q: 'Waterlooplein'});

        // The searchFormatter has ben called once
        expect(searchFormatter.formatCategories).toHaveBeenCalledTimes(1);
        expect(searchFormatter.formatCategories).toHaveBeenCalledWith(['FAKE_RAW_RESULTS', 'FAKE_RAW_RESULTS']);

        expect(searchResults).toBe('FAKE_FORMATTED_CATEGORIES_RESULTS');
    });

    it('can retrieve a single category based on a query', function () {
        var searchResults;

        search.search('Waterlooplein', 'openbare_ruimte').then(function (_searchResults_) {
            searchResults = _searchResults_;
        });

        $rootScope.$apply();

        // There has been 1 API call
        expect(api.getByUri).toHaveBeenCalledTimes(1);
        expect(api.getByUri).toHaveBeenCalledWith('path/to/openbare_ruimte/', {q: 'Waterlooplein'});

        // The searchFormatter has ben called once
        expect(searchFormatter.formatCategory).toHaveBeenCalledTimes(1);
        expect(searchFormatter.formatCategory).toHaveBeenCalledWith('openbare_ruimte', 'FAKE_RAW_RESULTS');

        // It gets converted to an Array (with one element) to keep the search-results.component consistent
        expect(searchResults).toEqual(['FAKE_FORMATTED_CATEGORY_RESULT']);
    });

    it('has a load more function that returns a new set of search results', function () {
        var searchResultsInput = {
                next: 'http://some-domain/path/to/slug/?q=waterloo&page=2&page_size=5',
                count: 11,
                results: [
                    'FAKE_FORMATTED_LINK_A',
                    'FAKE_FORMATTED_LINK_B',
                    'FAKE_FORMATTED_LINK_C',
                    'FAKE_FORMATTED_LINK_D',
                    'FAKE_FORMATTED_LINK_E'
                ]
            },
            searchResultsOutput;

        search.loadMore(searchResultsInput).then(function (_searchResultsOutput_) {
            searchResultsOutput = _searchResultsOutput_;
        });

        $rootScope.$apply();

        expect(searchFormatter.formatLinks).toHaveBeenCalledWith([
            'FAKE_LINK_F',
            'FAKE_LINK_G',
            'FAKE_LINK_H',
            'FAKE_LINK_I',
            'FAKE_LINK_J'
        ]);

        expect(searchResultsOutput.next).toBe('http://some-domain/path/to/slug/?q=waterloo&page=3&page_size=5');
        expect(searchResultsOutput.count).toBe(11);
        expect(searchResultsOutput.results).toEqual([
            'FAKE_FORMATTED_LINK_A',
            'FAKE_FORMATTED_LINK_B',
            'FAKE_FORMATTED_LINK_C',
            'FAKE_FORMATTED_LINK_D',
            'FAKE_FORMATTED_LINK_E',
            'FAKE_FORMATTED_LINK_F',
            'FAKE_FORMATTED_LINK_G',
            'FAKE_FORMATTED_LINK_H',
            'FAKE_FORMATTED_LINK_I',
            'FAKE_FORMATTED_LINK_J'
        ]);
    });

    it('updates the next link', function () {
        var searchResultsInput = {
                next: 'http://some-domain/path/to/slug/?q=waterloo&page=2&page_size=5',
                count: 11,
                results: [
                    'FAKE_FORMATTED_LINK_A',
                    'FAKE_FORMATTED_LINK_B',
                    'FAKE_FORMATTED_LINK_C',
                    'FAKE_FORMATTED_LINK_D',
                    'FAKE_FORMATTED_LINK_E'
                ]
            },
            searchResultsOutput;

        // Load the second page
        search.loadMore(searchResultsInput).then(function (_searchResultsOutput_) {
            searchResultsOutput = _searchResultsOutput_;
        });

        $rootScope.$apply();

        expect(searchResultsOutput.next).toBe('http://some-domain/path/to/slug/?q=waterloo&page=3&page_size=5');
        expect(searchResultsOutput.results.length).toBe(10);

        // Load the third (and last) page
        search.loadMore(searchResultsOutput).then(function (_searchResultsOutput_) {
            searchResultsOutput = _searchResultsOutput_;
        });

        $rootScope.$apply();

        expect(searchResultsOutput.next).toBeNull();
        expect(searchResultsOutput.results.length).toBe(11);
    });
});
