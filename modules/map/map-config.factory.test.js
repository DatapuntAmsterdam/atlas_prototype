describe('The mapConfig factory', function () {
    function prepareMocks (environmentName) {
        var mapConfig;

        angular.mock.module(
            'dpMap',
            function ($provide) {
                $provide.value('environment', {
                    NAME: environmentName
                });
            }
        );

        angular.mock.inject(function (_mapConfig_) {
            mapConfig = _mapConfig_;
        });

        return mapConfig;
    }

    describe('returns a combination of global and environment specific configuration', function () {
        it('development', function () {
            var mapConfig = prepareMocks('DEVELOPMENT');

            // Global config
            expect(mapConfig.BASE_LAYER_OPTIONS.minZoom).toBe(8);

            // Environment config
            expect(mapConfig.OVERLAY_ROOT)
                .toBe('https://map-acc.datapunt.amsterdam.nl/');
        });

        it('production', function () {
            var mapConfig = prepareMocks('PRODUCTION');

            // Global config
            expect(mapConfig.BASE_LAYER_OPTIONS.minZoom).toBe(8);

            // Environment config
            expect(mapConfig.OVERLAY_ROOT)
                .toBe('https://map.datapunt.amsterdam.nl/');
        });
    });
});
