describe('The overlays factory', () => {
    let $rootScope,
        overlays,
        userAuthLevel;

    beforeEach(() => {
        userAuthLevel = 0;

        angular.mock.module(
            'dpShared',
            {
                user: {
                    meetsRequiredLevel: level => level >= userAuthLevel,
                    getAuthorizationLevel: () => userAuthLevel
                }
            },
            $provide => {
                $provide.constant('OVERLAYS', {
                    SOURCES: {
                        a: {},
                        b: {
                            authorizationLevel: -1
                        },
                        c: {
                            authorizationLevel: 0
                        },
                        d: {
                            authorizationLevel: 1
                        }
                    },
                    HIERARCHY: [
                        {
                            heading: 'h1',
                            overlays: ['a']
                        },
                        {
                            heading: 'h2',
                            overlays: ['b', 'c']
                        }
                    ]
                });
            }
        );

        angular.mock.inject((_$rootScope_, _overlays_) => {
            $rootScope = _$rootScope_;
            overlays = _overlays_;
        });
    });

    it('filters the overlays on the users authorization level', () => {
        expect(overlays.SOURCES).toEqual({
            c: {
                authorizationLevel: 0
            },
            d: {
                authorizationLevel: 1
            }
        });
        expect(overlays.HIERARCHY).toEqual([
            {
                heading: 'h2',
                overlays: ['c']
            }
        ]);
    });

    it('recreates the overlays on change of user\'s authorization level', () => {
        userAuthLevel = 1;
        $rootScope.$digest();

        expect(overlays.SOURCES).toEqual({
            d: {
                authorizationLevel: 1
            }
        });
        expect(overlays.HIERARCHY).toEqual(
            []
        );
    });
});
