describe('The filterName factory', function () {
    var filterNames;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            function ($provide) {
                $provide.constant('dataSelectionConfig', {
                    bag: {
                        FILTERS: [{
                            canonical: 'stadsdeel',
                            slug: 'stadsdeel_naam',
                            label: 'Stadsdeel'
                        }]
                    }
                });
            }
        );

        angular.mock.inject(function (_dataSelectionFilterNames_) {
            filterNames = _dataSelectionFilterNames_;
        });
    });

    it('returns the key name for a filter based on a canonical name', function () {
        expect(filterNames.getSlugFor('stadsdeel')).toBe('stadsdeel_naam');
    });
});
