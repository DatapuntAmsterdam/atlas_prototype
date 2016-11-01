describe('The straatbeeldConfig factory', function () {
    function prepareMocks (environmentName) {
        var straatbeeldConfig;

        angular.mock.module(
            'dpStraatbeeld',
            function ($provide) {
                $provide.value('environment', {
                    NAME: environmentName
                });
            }
        );

        angular.mock.inject(function (_straatbeeldConfig_) {
            straatbeeldConfig = _straatbeeldConfig_;
        });

        return straatbeeldConfig;
    }

    describe('returns environment specific configuration', function () {
        it('development', function () {
            var straatbeeldConfig = prepareMocks('DEVELOPMENT');

            expect(straatbeeldConfig.STRAATBEELD_ENDPOINT)
                .toBe('https://api-acc.datapunt.amsterdam.nl/panorama/opnamelocatie/');
        });

        it('production', function () {
            var straatbeeldConfig = prepareMocks('PRODUCTION');

            expect(straatbeeldConfig.STRAATBEELD_ENDPOINT)
                .toBe('https://api.datapunt.amsterdam.nl/panorama/opnamelocatie/');
        });
    });
});
