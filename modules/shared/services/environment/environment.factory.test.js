describe('The environment factory', function () {
    var mockedHostname;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                $location: {
                    host: function () {
                        return mockedHostname;
                    }
                }
            },
            function ($provide) {
                $provide.constant('ENVIRONMENT_CONFIG', {
                    PRODUCTION: {
                        favorite_animal: 'dog',
                        number_of_hobbies: 3
                    },
                    DEVELOPMENT: {
                        favorite_animal: 'cat',
                        number_of_hobbies: 1
                    }
                });
            }
        );
    });

    describe('returns different configuration based on the hostname', function () {
        it('has support for PRODUCTION', function () {
            mockedHostname = 'atlas.amsterdam.nl';

            angular.mock.inject(function (environment) {
                expect(environment).toEqual({
                    NAME: 'PRODUCTION',
                    favorite_animal: 'dog',
                    number_of_hobbies: 3
                });
            });
        });

        it('and a fallback to development for the rest', function () {
            var hostnames = ['localhost', 'example.com', 'acc.atlas.amsterdam.nl'];

            hostnames.forEach(function (hostname) {
                mockedHostname = hostname;

                angular.mock.inject(function (environment) {
                    expect(environment).toEqual({
                        NAME: 'DEVELOPMENT',
                        favorite_animal: 'cat',
                        number_of_hobbies: 1
                    });
                });
            });
        });
    });
});
