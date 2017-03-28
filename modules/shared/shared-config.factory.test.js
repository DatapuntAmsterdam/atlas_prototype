describe('The sharedConfig factory', function () {
    function prepareMocks (environmentName) {
        let sharedConfig;

        angular.mock.module(
            'dpShared',
            function ($provide) {
                $provide.value('environment', {
                    NAME: environmentName
                });
            }
        );

        angular.mock.inject(function (_sharedConfig_) {
            sharedConfig = _sharedConfig_;
        });

        return sharedConfig;
    }

    describe('returns a combination of global and environment specific configuration', function () {
        it('DEVELOPMENT', function () {
            const sharedConfig = prepareMocks('DEVELOPMENT');

            // Global config
            expect(sharedConfig.RADIUS).toBe(50);
            expect(sharedConfig.THUMBNAIL_WIDTH).toBe(240);
            expect(sharedConfig.STRAATBEELD_THUMB_URL).toBe('panorama/thumbnail/');

            // Environment config
            expect(sharedConfig.API_ROOT).toBe('https://api-acc.datapunt.amsterdam.nl/');
        });

        it('ACCEPTATION', function () {
            const sharedConfig = prepareMocks('ACCEPTATION');

            // Global config
            expect(sharedConfig.RADIUS).toBe(50);
            expect(sharedConfig.THUMBNAIL_WIDTH).toBe(240);
            expect(sharedConfig.STRAATBEELD_THUMB_URL).toBe('panorama/thumbnail/');

            // Environment config
            expect(sharedConfig.API_ROOT).toBe('https://api-acc.datapunt.amsterdam.nl/');
        });

        it('PRODUCTION', function () {
            const sharedConfig = prepareMocks('PRODUCTION');

            // Global config
            expect(sharedConfig.RADIUS).toBe(50);
            expect(sharedConfig.THUMBNAIL_WIDTH).toBe(240);
            expect(sharedConfig.STRAATBEELD_THUMB_URL).toBe('panorama/thumbnail/');

            // Environment config
            expect(sharedConfig.API_ROOT).toBe('https://api-acc.datapunt.amsterdam.nl/');
        });
    });
});
