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

            // Global config
            expect(dataSelectionConfig.bag.PRIMARY_KEY).toBe('id');

            // Environment config
            expect(dataSelectionConfig.bag.ENDPOINT_PREVIEW)
                .toBe('https://api-acc.datapunt.amsterdam.nl/dataselectie/bag/');
        });

        it('production', function () {
            var dataSelectionConfig = prepareMocks('PRODUCTION');

            // Global config
            expect(dataSelectionConfig.bag.PRIMARY_KEY).toBe('id');

            // Environment config
            expect(dataSelectionConfig.bag.ENDPOINT_PREVIEW)
                .toBe('https://api.datapunt.amsterdam.nl/dataselectie/bag/');
        });
    });
});
