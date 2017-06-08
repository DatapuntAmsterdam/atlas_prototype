describe('The environment factory', function () {
    let mockedHostname;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                $location: {
                    host: function () {
                        return mockedHostname;
                    }
                }
            }
        );
    });

    describe('returns different configuration based on the hostname', function () {
        it('has support for PRODUCTION', function () {
            mockedHostname = 'atlas.amsterdam.nl';

            angular.mock.inject(function (environment) {
                expect(environment).toEqual({
                    NAME: 'PRODUCTION'
                });
            });
        });

        it('also uses PRODUCTION on data.amsterdam.nl', function () {
            mockedHostname = 'data.amsterdam.nl';

            angular.mock.inject(function (environment) {
                expect(environment).toEqual({
                    NAME: 'PRODUCTION'
                });
            });
        });

        it('also uses PRODUCTION on demo3.atlas.amsterdam.nl', function () {
            mockedHostname = 'demo3.atlas.amsterdam.nl';

            angular.mock.inject(function (environment) {
                expect(environment).toEqual({
                    NAME: 'PRODUCTION'
                });
            });
        });

        it('uses PRE_PRODUCTION on pre.atlas.amsterdam.nl and pre.data.amsterdam.nl', () => {
            const hostnames = ['pre.atlas.amsterdam.nl', 'pre.data.amsterdam.nl'];

            hostnames.forEach(function (hostname) {
                mockedHostname = hostname;

                angular.mock.inject(function (environment) {
                    expect(environment).toEqual({
                        NAME: 'PRE_PRODUCTION'
                    });
                });
            });
        });

        it('uses ACCEPTATION on acc.atlas.amsterdam.nl and acc.data.amsterdam.nl', () => {
            const hostnames = ['acc.atlas.amsterdam.nl', 'acc.data.amsterdam.nl'];

            hostnames.forEach(function (hostname) {
                mockedHostname = hostname;

                angular.mock.inject(function (environment) {
                    expect(environment).toEqual({
                        NAME: 'ACCEPTATION'
                    });
                });
            });
        });

        it('and a fallback to development for the rest', function () {
            const hostnames = ['localhost', 'example.com', 'acc.atlas.amsterdam.nl'];

            hostnames.forEach(function (hostname) {
                mockedHostname = hostname;

                angular.mock.inject(function (environment) {
                    expect(environment).toEqual({
                        NAME: 'DEVELOPMENT'
                    });
                });
            });
        });
    });
});
