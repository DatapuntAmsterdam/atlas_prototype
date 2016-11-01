describe('The sharedConfig factory', function () {
    function prepareMocks (environmentName) {
        var sharedConfig;

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

    describe('returns environment specific configuration', function () {
        it('development', function () {
            var sharedConfig = prepareMocks('DEVELOPMENT');

            expect(sharedConfig.STRAATBEELD_THUMB_URL)
                .toBe('https://api-acc.datapunt.amsterdam.nl/panorama/thumbnail/');
        });

        it('production', function () {
            var sharedConfig = prepareMocks('PRODUCTION');

            expect(sharedConfig.STRAATBEELD_THUMB_URL)
                .toBe('https://api.datapunt.amsterdam.nl/panorama/thumbnail/');
        });
    });
});
