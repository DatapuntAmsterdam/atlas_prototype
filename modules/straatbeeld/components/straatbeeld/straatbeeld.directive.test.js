describe('The dp-straatbeeld directive', function () {
    var $compile,
        $rootScope,
        store,
        scope,
        $q,
        marzipanoService,
        orientation,
        mockedMarzipanoViewer;

    beforeEach(function () {
        angular.mock.module('dpStraatbeeld', {
            store: {
                dispatch: function () { }
            },
            marzipanoService: {
                initialize: function () {
                    return {
                        ...mockedMarzipanoViewer,
                        addEventListener: () => {},
                        removeEventListener: () => {}
                    };
                },
                loadScene: function () { }
            },
            orientation: {
                update: function () { }
            },
            straatbeeldApi: {
                getImageDataById: function () {
                    var q = $q.defer();
                    q.resolve({ foo: 'bar' });
                    return q.promise;
                },
                getImageDataByLocation: function () {
                    var q = $q.defer();
                    q.resolve({ foo: 'bar' });
                    return q.promise;
                }
            }
        });

        angular.mock.inject(function (
            _$compile_,
            _$rootScope_,
            _store_,
            _$q_,
            _marzipanoService_,
            _orientation_
        ) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            $q = _$q_;
            marzipanoService = _marzipanoService_;
            orientation = _orientation_;
        });

        spyOn(store, 'dispatch');
        spyOn(marzipanoService, 'loadScene');
        spyOn(marzipanoService, 'initialize').and.callThrough();
        spyOn(orientation, 'update');

        mockedMarzipanoViewer = {
            updateSize: function () {}
        };
    });

    function getDirective (state, resize) {
        var el = document.createElement('dp-straatbeeld');
        el.setAttribute('state', 'state');
        el.setAttribute('resize', 'resize');

        scope = $rootScope.$new();

        scope.state = state;
        scope.resize = resize;
        scope.backToMap = 'SOME_ACTION';

        var directive = $compile(el)(scope);
        scope.$apply();

        return directive;
    }

    describe('image state change triggers', function () {
        it('Listens to changes on scope to trigger marzipanoService.loadscene', function () {
            var directive = getDirective({}, false);

            expect(marzipanoService.loadScene).not.toHaveBeenCalled();

            directive.isolateScope().state.image = {
                pattern: 'http://example.com/1/{a}/{b}/{c}.png',
                preview: 'http://example.com/1/preview.png'
            };
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).toHaveBeenCalledTimes(1);

            directive.isolateScope().state.image.pattern = 'http://example.com/2/{a}/{b}/{c}.png';
            directive.isolateScope().state.image.preview = 'http://example.com/2/preview.png';
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).toHaveBeenCalledTimes(2);
        });

        it('Does not call Marzipano.loadscene when state.image is null', function () {
            var state = {
                image: null
            };

            getDirective(state, false);

            expect(marzipanoService.loadScene).not.toHaveBeenCalled();
        });

        it('Does call Marzipano.loadscene when state.image exists', function () {
            var state = {
                image: {
                    pattern: 'http://example.com/example/{a}/{b}/{c}.png',
                    preview: 'http://example.com/example/preview.png'
                },
                heading: 179,
                pitch: 1,
                fov: 2,
                hotspots: ['a', 'b']
            };

            getDirective(state, false);

            expect(marzipanoService.loadScene).toHaveBeenCalledWith(
                {
                    pattern: 'http://example.com/example/{a}/{b}/{c}.png',
                    preview: 'http://example.com/example/preview.png'
                },
                179,
                1,
                2,
                ['a', 'b']
            );
        });
    });

    describe('Changing hotspots', function () {
        let directive;

        beforeEach(() => {
            directive = getDirective({
                image: {
                    pattern: 'http://example.com/example/{a}/{b}/{c}.png',
                    preview: 'http://example.com/example/preview.png'
                }
            }, false);
        });

        it('Triggers marzipano to load the scene', function () {
            marzipanoService.loadScene.calls.reset();

            directive.isolateScope().state.hotspots = [{
                id: 'TMX7316010203-000224_pano_0000_000852',
                year: 2020
            }, {
                id: 'TMX7316010203-000224_pano_0000_000853',
                year: 2020
            }];
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).toHaveBeenCalledTimes(1);
            marzipanoService.loadScene.calls.reset();

            directive.isolateScope().state.hotspots[0].year = 2017;
            directive.isolateScope().state.hotspots[1].year = 2017;
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).toHaveBeenCalledTimes(1);
        });

        it('Triggers load scene on entire new array', function () {
            marzipanoService.loadScene.calls.reset();

            directive.isolateScope().state.hotspots = [{
                id: 'TMX7316010203-000224_pano_0000_000852',
                year: 2020
            }, {
                id: 'TMX7316010203-000224_pano_0000_000853',
                year: 2020
            }];
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).toHaveBeenCalledTimes(1);
            marzipanoService.loadScene.calls.reset();

            directive.isolateScope().state.hotspots = [{
                id: 'TMX7316010203-000224_pano_0000_000852',
                year: 2017
            }, {
                id: 'TMX7316010203-000224_pano_0000_000853',
                year: 2017
            }];
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).toHaveBeenCalledTimes(1);
        });

        it('Does not trigger load scene on entire new array with the exact same data', function () {
            marzipanoService.loadScene.calls.reset();

            directive.isolateScope().state.hotspots = [{
                id: 'TMX7316010203-000224_pano_0000_000852',
                year: 2020
            }, {
                id: 'TMX7316010203-000224_pano_0000_000853',
                year: 2020
            }];
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).toHaveBeenCalledTimes(1);
            marzipanoService.loadScene.calls.reset();

            directive.isolateScope().state.hotspots = [{
                id: 'TMX7316010203-000224_pano_0000_000852',
                year: 2020
            }, {
                id: 'TMX7316010203-000224_pano_0000_000853',
                year: 2020
            }];
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).not.toHaveBeenCalled();
        });
    });
});
