describe('The dpDataSelectionDocumentTitle factory', () => {
    let dpDataSelectionDocumentTitle,
        mockedBagState,
        mockedHrState,
        mockedCardsState;

    beforeEach(() => {
        angular.mock.module(
            'dpDataSelection',
            $provide => {
                $provide.constant('DATA_SELECTION_CONFIG', {
                    datasets: {
                        bag: {
                            TITLE: 'Adressen',
                            FILTERS: [
                                {
                                    slug: 'stadsdeel_naam',
                                    label: 'Stadsdeel'
                                },
                                {
                                    slug: 'buurt_naam',
                                    label: 'Buurt'
                                }
                            ]
                        },
                        hr: {
                            TITLE: 'Handelsregister',
                            FILTERS: []
                        },
                        catalogus: {
                            TITLE: 'Catalogus',
                            FILTERS: [
                                {
                                    slug: 'groups',
                                    label: 'Thema\'s'
                                }
                            ]
                        }
                    }
                });
            }
        );

        angular.mock.inject(_dpDataSelectionDocumentTitle_ => {
            dpDataSelectionDocumentTitle = _dpDataSelectionDocumentTitle_;
        });

        mockedBagState = {
            dataset: 'bag',
            view: 'TABLE',
            filters: {},
            geometryFilter: {}
        };

        mockedHrState = {
            dataset: 'hr',
            view: 'TABLE',
            filters: {},
            geometryFilter: {}
        };

        mockedCardsState = {
            dataset: 'catalogus',
            view: 'CARDS',
            query: 'my query',
            filters: {},
            geometryFilter: {}
        };
    });

    it('shows a different title based on the active view', () => {
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toMatch(/^Tabel/);

        mockedBagState.view = 'LIST';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toMatch(/^Lijst/);
    });

    it('shows a special title when showing all datasets', () => {
        delete mockedCardsState.query;
        expect(dpDataSelectionDocumentTitle.getTitle(mockedCardsState)).toBe('Datasets');
    });

    it('shows a the datasets query for text search in datasets', () => {
        expect(dpDataSelectionDocumentTitle.getTitle(mockedCardsState)).toBe('Datasets met \'my query\'');
    });

    it('shows both the query and the active filter', () => {
        mockedCardsState.filters.groups = 'bestuur-en-organisatie';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedCardsState))
            .toBe('Datasets met \'my query\', bestuur-en-organisatie');
    });

    it('shows the surface of the current selection', () => {
        mockedBagState.geometryFilter = {
            description: '1,95 km en 216.980,2 m&sup2;',
            markers: [{}, {}]
        };

        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState))
            .toBe('Tabel adressen met ingetekend (1,95 km en 216.980,2 m²)');
    });

    it('shows the title of the current dataset', () => {
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toBe('Tabel adressen');

        expect(dpDataSelectionDocumentTitle.getTitle(mockedHrState)).toBe('Tabel handelsregister');
    });

    it('optionally lists the (selected values of the) active filters', () => {
        // One active filter
        mockedBagState.filters.stadsdeel_naam = 'Oost';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toBe('Tabel adressen met Oost');

        // Two active filters (comma-separated_
        mockedBagState.filters.buurt_naam = 'Flevopark';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toBe('Tabel adressen met Oost, Flevopark');
    });

    it('respects the filter order from DATA_SELECTION_CONFIG', () => {
        mockedBagState.filters = {
            stadsdeel_naam: 'Oost',
            buurt_naam: 'Flevopark'
        };

        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toBe('Tabel adressen met Oost, Flevopark');
    });
});
