describe('The detailConfig factory', function () {
    function prepareMocks (environmentName) {
        var detailConfig;

        angular.mock.module(
            'atlasDetail',
            function ($provide) {
                $provide.value('environment', {
                    NAME: environmentName
                });
            }
        );

        angular.mock.inject(function (_detailConfig_) {
            detailConfig = _detailConfig_;
        });

        return detailConfig;
    }

    describe('returns environment specific configuration', function () {
        it('development', function () {
            var detailConfig = prepareMocks('DEVELOPMENT');

            expect(detailConfig.STRAATBEELD_THUMB_URL)
                .toBe('https://map-acc.datapunt.amsterdam.nl/earthmine/get_views.php');
        });

        it('production', function () {
            var detailConfig = prepareMocks('PRODUCTION');

            expect(detailConfig.STRAATBEELD_THUMB_URL)
                .toBe('https://map.datapunt.amsterdam.nl/earthmine/get_views.php');
        });
    });
});
