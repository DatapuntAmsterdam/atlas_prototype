describe('The mapConfig factory', function () {
    function prepareMocks (environmentName) {
        var mapConfig;

        angular.mock.module(
            'dpMap',
            function ($provide) {
                $provide.value('environment', {
                    NAME: environmentName
                });

                $provide.constant('BOUNDING_BOX', {
                    COORDINATES: {
                        southWest: [55, 5],
                        northEast: [50, 4]
                    }
                });
            }
        );

        angular.mock.inject(function (_mapConfig_) {
            mapConfig = _mapConfig_;
        });

        return mapConfig;
    }

    describe('returns a combination of global and environment specific configuration', function () {
        it('DEVELOPMENT', function () {
            const mapConfig = prepareMocks('DEVELOPMENT');

            // Global config
            expect(mapConfig.BASE_LAYER_OPTIONS.minZoom).toBe(8);

            // Environment config
            expect(mapConfig.OVERLAY_ROOT)
                .toBe('https://map-acc.datapunt.amsterdam.nl/');
        });

        it('ACCEPTATION', function () {
            const mapConfig = prepareMocks('ACCEPTATION');

            // Global config
            expect(mapConfig.BASE_LAYER_OPTIONS.minZoom).toBe(8);

            // Environment config
            expect(mapConfig.OVERLAY_ROOT)
                .toBe('https://map-acc.datapunt.amsterdam.nl/');
        });

        it('PRODUCTION', function () {
            const mapConfig = prepareMocks('PRODUCTION');

            // Global config
            expect(mapConfig.BASE_LAYER_OPTIONS.minZoom).toBe(8);

            // Environment config
            expect(mapConfig.OVERLAY_ROOT)
                .toBe('https://map-acc.datapunt.amsterdam.nl/');
        });
    });

    it('prevents Leaflet from loading unavailable tiles', () => {
        // Fixes tg-2707; triggering API errors when accessing unavailable WMS tiles.
        const mapConfig = prepareMocks('DEVELOPMENT');

        expect(mapConfig.MAP_OPTIONS.maxBounds).toEqual([[55, 5], [50, 4]]);
        expect(mapConfig.MAP_OPTIONS.maxBoundsViscosity).toBe(1.0);
        expect(mapConfig.MAP_OPTIONS.bounceAtZoomLimits).toBe(false);
        expect(mapConfig.BASE_LAYER_OPTIONS.bounds).toEqual([[55, 5], [50, 4]]);
    });
});
