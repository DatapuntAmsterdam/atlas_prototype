describe('The search title factory', function () {
    var searchTitle;

    beforeEach(function () {
        angular.mock.module(
            'dpSearchResults',
            function ($provide) {
                $provide.constant('SEARCH_CONFIG', {
                    QUERY_ENDPOINTS: [
                        {
                            slug: 'openbare_ruimte',
                            label_singular: 'Openbare ruimte',
                            label_plural: 'Openbare ruimtes',
                            uri: 'path/to/openbare_ruimte/'
                        }, {
                            slug: 'adres',
                            label_singular: 'Adres',
                            label_plural: 'Adressen',
                            uri: 'path/to/adres/'
                        }
                    ]
                });

                $provide.value('coordinatesFilter', function (input) {
                    return 'X, Y (' + input.join(', ') + ')';
                });
            }
        );

        angular.mock.inject(function (_searchTitle_) {
            searchTitle = _searchTitle_;
        });
    });

    it('can show the number of search results when searching with a query', function () {
        var titleData = searchTitle.getTitleData(45, 'westerpark', null, null);

        expect(titleData.title).toContain('45 resultaten');
        expect(titleData.subTitle).toContain('"westerpark"');
    });

    it('returns an empty title and empty subtitle on a negative search result', function () {
        var titleData = searchTitle.getTitleData(-1, 'westerpark', null, null);

        expect(titleData.title).toBe('');
        expect(titleData.subTitle).toBe('');
    });

    it('returns an empty title and subtitle when no query or location is specified', function () {
        var titleData = searchTitle.getTitleData(-1, null, null, null);

        expect(titleData.title).toBe('');
        expect(titleData.subTitle).toBe('');
    });

    it('can show the number of search results when searching by location', function () {
        var titleData = searchTitle.getTitleData(46, null, [52.123, 4.789], null);

        expect(titleData.title).toContain('46 resultaten');
        expect(titleData.subTitle).toContain('X, Y (52.123, 4.789)');
    });

    it('can show the number of search results for a specific category (query search only)', function () {
        var titleData = searchTitle.getTitleData(47, 'westerpark', null, 'adres');

        // The category name will be converted to lowercase
        expect(titleData.title).toContain('47 adressen');
        expect(titleData.subTitle).toContain('"westerpark"');
    });

    it('shows a message when no results have been found', function () {
        var titleData;

        // When searching by query
        titleData = searchTitle.getTitleData(0, 'westerpark', null, null);
        expect(titleData.title).toContain('Geen resultaten gevonden');
        expect(titleData.subTitle).toContain('"westerpark"');

        // When searching by location
        titleData = searchTitle.getTitleData(0, null, [52.123, 4.789], null);
        expect(titleData.title).toContain('Geen resultaten gevonden');
        expect(titleData.subTitle).toContain('X, Y (52.123, 4.789)');
    });

    it('differentiates between one or more search results (resultaat vs. resultaten)', function () {
        var titleData;

        // When searching by query (1 result)
        titleData = searchTitle.getTitleData(1, 'oosterpark', null, null);
        expect(titleData.title).toContain('1 resultaat');

        // When searching by query (> 1 results)
        titleData = searchTitle.getTitleData(2, 'oosterpark', null, null);
        expect(titleData.title).toContain('2 resultaten');

        // When searching by location (1 result)
        titleData = searchTitle.getTitleData(1, null, [52.321, 4.987], null);
        expect(titleData.title).toContain('1 resultaat');

        // When searching by location (> 1 results)
        titleData = searchTitle.getTitleData(2, null, [52.321, 4.987], null);
        expect(titleData.title).toContain('2 resultaten');
    });

    it('uses a thousands separator for the number of search results', function () {
        var titleData;

        // When searching by query
        titleData = searchTitle.getTitleData(1000, 'zuiderpark', null, null);
        expect(titleData.title).not.toContain('1000');
        expect(titleData.title).toContain('1.000');

        // When searching by location
        titleData = searchTitle.getTitleData(1000, null, [52.963, 4.741], null);
        expect(titleData.title).not.toContain('1000');
        expect(titleData.title).toContain('1.000');

        // When viewing a category of search results
        titleData = searchTitle.getTitleData(1000, 'zuiderpark', null, 'adres');
        expect(titleData.title).not.toContain('1000');
        expect(titleData.title).toContain('1.000');
    });
});
