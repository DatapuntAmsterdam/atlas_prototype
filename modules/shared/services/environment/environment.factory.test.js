describe('The environment factory', () => {
    let mockedHostname;

    beforeEach(() => {
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

    describe('returns different configuration based on the hostname', () => {
        it('has support for PRODUCTION', () => {
            mockedHostname = 'data.amsterdam.nl';

            angular.mock.inject(environment => {
                expect(environment.NAME).toEqual('PRODUCTION');
            });
        });

        it('uses PRE_PRODUCTION on pre.data.amsterdam.nl', () => {
            mockedHostname = 'pre.data.amsterdam.nl';

            angular.mock.inject(environment => {
                expect(environment.NAME).toEqual('PRE_PRODUCTION');
            });
        });

        it('uses ACCEPTATION on acc.data.amsterdam.nl', () => {
            mockedHostname = 'acc.data.amsterdam.nl';

            angular.mock.inject(environment => {
                expect(environment.NAME).toEqual('ACCEPTATION');
            });
        });

        it('and a fallback to development for the rest', () => {
            mockedHostname = 'localhost';

            angular.mock.inject(environment => {
                expect(environment.NAME).toEqual('DEVELOPMENT');
            });
        });

        describe('the development check', () => {
            it('is true for a development host', () => {
                mockedHostname = 'localhost';

                angular.mock.inject(environment => {
                    expect(environment.isDevelopment()).toBe(true);
                });
            });
            it('is false for an other host', () => {
                mockedHostname = 'data.amsterdam.nl';

                angular.mock.inject(environment => {
                    expect(environment.isDevelopment()).toBe(false);
                });
            });
        });
    });
});
