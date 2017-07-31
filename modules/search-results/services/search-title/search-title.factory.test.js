describe('The search title factory', () => {
    var searchTitle;

    beforeEach(() => {
        angular.mock.module(
            'dpSearchResults',
            $provide => {
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
                    ],
                    COORDINATES_HIERARCHY: [
                        {
                            slug: 'monument',
                            label_singular: 'Monument',
                            label_plural: 'Monumenten',
                            features: [
                                'monumenten/monument'
                            ]
                        }
                    ]
                });

                $provide.value('coordinatesFilter', input => 'X, Y (' + input.join(', ') + ')');
            }
        );

        angular.mock.inject(_searchTitle_ => {
            searchTitle = _searchTitle_;
        });
    });

    it('can show the number of search results when searching with a query', () => {
        var titleData = searchTitle.getTitleData(45, 'westerpark', null, null);

        expect(titleData.title).toBe('Resultaten (45)');
        expect(titleData.subTitle).toContain('\'westerpark\'');
    });

    it('returns an empty title and empty subtitle on a negative search result', () => {
        var titleData = searchTitle.getTitleData(-1, 'westerpark', null, null);

        expect(titleData.title).toBe('');
        expect(titleData.subTitle).toBe('');
    });

    it('returns an empty title and subtitle when no query or location is specified', () => {
        var titleData = searchTitle.getTitleData(-1, null, null, null);

        expect(titleData.title).toBe('');
        expect(titleData.subTitle).toBe('');
    });

    it('can show the number of search results when searching by location', () => {
        var titleData = searchTitle.getTitleData(46, null, [52.123, 4.789], null);

        expect(titleData.title).toBe('Resultaten (46)');
        expect(titleData.subTitle).toContain('X, Y (52.123, 4.789)');
    });

    it('can show category and query', () => {
        var titleData = searchTitle.getTitleData(47, 'westerpark', null, 'adres', [{slug: 'adres', count: 13}]);

        expect(titleData.title).toBe('Adressen (13)');
        expect(titleData.subTitle).toBe('met \'westerpark\'');
    });

    it('can show category and location', () => {
        var titleData = searchTitle.getTitleData(
            47, null, [52.123, 4.789], 'monument', [{slug: 'monument', count: 14}]);

        expect(titleData.title).toBe('Monumenten (14)');
        expect(titleData.subTitle).toBe('met locatie X, Y (52.123, 4.789)');
    });

    it('does not show a count when no search results are specified', () => {
        var titleData = searchTitle.getTitleData(
            47, null, [52.123, 4.789], 'monument');

        expect(titleData.title).toBe('Monumenten');
        expect(titleData.subTitle).toBe('met locatie X, Y (52.123, 4.789)');
    });

    it('shows a message when no results have been found', () => {
        var titleData;

        // When searching by query
        titleData = searchTitle.getTitleData(0, 'westerpark', null, null);
        expect(titleData.title).toBe('Geen resultaten gevonden');
        expect(titleData.subTitle).toContain('\'westerpark\'');

        // When searching by location
        titleData = searchTitle.getTitleData(0, null, [52.123, 4.789], null);
        expect(titleData.title).toBe('Geen resultaten gevonden');
        expect(titleData.subTitle).toContain('X, Y (52.123, 4.789)');
    });
});
