describe('The dataSelectionConfig factory', function () {
    function prepareMocks (environmentName) {
        var dataSelectionConfig;

        angular.mock.module(
            'dpDataSelection',
            function ($provide) {
                $provide.value('environment', {
                    NAME: environmentName
                });
            }
        );

        angular.mock.inject(function (_dataSelectionConfig_) {
            dataSelectionConfig = _dataSelectionConfig_;
        });

        return dataSelectionConfig;
    }

    describe('returns a combination of global and environment specific configuration', function () {
        it('development', function () {
            var dataSelectionConfig = prepareMocks('DEVELOPMENT');

            // Environment config
            expect(dataSelectionConfig.bag.ENDPOINT_EXPORT)
                .toBe('https://api-acc.datapunt.amsterdam.nl/dataselectie/bag/export/');
            expect(dataSelectionConfig.bag.ENDPOINT_DETAIL)
                .toBe('https://api-acc.datapunt.amsterdam.nl/bag/nummeraanduiding/');
        });

        it('production', function () {
            var dataSelectionConfig = prepareMocks('PRODUCTION');

            // Environment config
            expect(dataSelectionConfig.bag.ENDPOINT_EXPORT)
                .toBe('https://api.datapunt.amsterdam.nl/dataselectie/bag/export/');
            expect(dataSelectionConfig.bag.ENDPOINT_DETAIL)
                .toBe('https://api.datapunt.amsterdam.nl/bag/nummeraanduiding/');
        });
    });
});
