describe('The dpDataSelectionDocumentTitle factory', function () {
    var dpDataSelectionDocumentTitle,
        mockedBagState,
        mockedHrState;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                dataSelectionConfig: {
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
                    }
                }
            }
        );

        angular.mock.inject(function (_dpDataSelectionDocumentTitle_) {
            dpDataSelectionDocumentTitle = _dpDataSelectionDocumentTitle_;
        });

        mockedBagState = {
            dataset: 'bag',
            filters: {}
        };

        mockedHrState = {
            dataset: 'hr',
            filters: {}
        };
    });

    it('shows the title of the current dataset', function () {
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toBe('Tabel Adressen');

        expect(dpDataSelectionDocumentTitle.getTitle(mockedHrState)).toBe('Tabel Handelsregister');
    });

    it('optionally lists the (selected values of the) active filters', function () {
        // One active filter
        mockedBagState.filters.stadsdeel_naam = 'Oost';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toBe('Tabel Adressen met Oost');

        // Two active filters (comma-separated_
        mockedBagState.filters.buurt_naam = 'Flevopark';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toBe('Tabel Adressen met Oost, Flevopark');
    });

    it('respects the filter order from the dataSelectionConfig', function () {
        mockedBagState.filters = {
            stadsdeel_naam: 'Oost',
            buurt_naam: 'Flevopark'
        };

        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState)).toBe('Tabel Adressen met Oost, Flevopark');
    });
});
