describe('The dp-straatbeeld directive', function () {
    var $compile,
        $rootScope,
        $store,
        ACTIONS,
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
                    return mockedMarzipanoViewer;
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
                }
            }
        });

        angular.mock.inject(function (
            _$compile_,
            _$rootScope_,
            _store_,
            _ACTIONS_,
            _$q_,
            _marzipanoService_,
            _orientation_
        ) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $store = _store_;
            ACTIONS = _ACTIONS_;
            $q = _$q_;
            marzipanoService = _marzipanoService_;
            orientation = _orientation_;
        });

        spyOn($store, 'dispatch');
        spyOn(marzipanoService, 'loadScene');
        spyOn(marzipanoService, 'initialize').and.callThrough();
        spyOn(orientation, 'update');

        mockedMarzipanoViewer = {
            updateSize: function () {}
        };
    });

    function triggerMousemove (element) {
        var event;

        event = angular.element.Event('mousemove');

        element.trigger(event);
    }

    function getDirective (state, isPrintMode) {
        var el = document.createElement('dp-straatbeeld');
        el.setAttribute('state', 'state');
        el.setAttribute('is-print-mode', 'isPrintMode');

        var scope = $rootScope.$new();

        scope.state = state;
        scope.isPrintMode = isPrintMode;

        var directive = $compile(el)(scope);
        scope.$apply();

        return directive;
    }

    describe('Calls to SHOW_STRAATBEELD_INITIAL and SUBSEQUENT', function () {
        it('Does not call SHOW_STRAATBEELD_INITIAL Or SUBSEQUENT IF State.id is unknown', function () {
            var state = {};

            getDirective(state, false);

            expect($store.dispatch).not.toHaveBeenCalled();
        });

        it('Does call SHOW_STRAATBEELD_INITIAL', function () {
            var state = {
                id: 'ABC',
                isInitial: true
            };

            getDirective(state, false);

            expect($store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_STRAATBEELD_INITIAL,
                payload: {
                    foo: 'bar'
                }
            });
        });

        it('Does call SHOW_STRAATBEELD_SUBSEQUENT', function () {
            var state = {
                id: 'ABC',
                isInitial: false
            };

            getDirective(state, false);

            expect($store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
                payload: {
                    foo: 'bar'
                }
            });
        });

        it('Listens to changes on scope for id', function () {
            var directive = getDirective({}, false);
            expect($store.dispatch).not.toHaveBeenCalled();

            directive.isolateScope().state.id = 'ABC';
            directive.isolateScope().$apply();

            expect($store.dispatch).toHaveBeenCalledTimes(2);   // show pano and change location

            directive.isolateScope().state.id = 'XYZ';
            directive.isolateScope().$apply();

            expect($store.dispatch).toHaveBeenCalledTimes(4);
        });

        it('triggers both show and location actions', function () {
            var directive = getDirective({}, false);
            expect($store.dispatch).not.toHaveBeenCalled();

            directive.isolateScope().state.id = 'ABC';
            directive.isolateScope().$apply();

            expect($store.dispatch).toHaveBeenCalledTimes(2);   // show pano and change location
            expect($store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
                payload: {
                    foo: 'bar'
                }
            });
            expect($store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.LOCATION_CHANGE,
                payload: undefined
            });
        });
    });

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

    describe('set orientation on mouse move', function () {
        it('calls the orientation factory on mousemove to keep the state in sync', function () {
            var directive;

            directive = getDirective({
                id: 123,
                location: [52, 4],
                heading: 275,
                pitch: 1,
                isLoading: false
            }, false);

            expect(orientation.update).not.toHaveBeenCalled();

            triggerMousemove(directive.find('.js-marzipano-viewer'));

            expect(orientation.update).toHaveBeenCalledWith(mockedMarzipanoViewer);
        });

        it('doesn\'t call the orientation factory before the scene is done loading', function () {
            var directive,
                mockedState;

            mockedState = {
                id: 'ABC',
                isLoading: true
            };

            // When it is still loading
            directive = getDirective(mockedState, false);
            expect(orientation.update).not.toHaveBeenCalled();

            triggerMousemove(directive.find('.js-marzipano-viewer'));
            expect(orientation.update).not.toHaveBeenCalled();

            // When it is done loading
            mockedState.isLoading = false;
            triggerMousemove(directive.find('.js-marzipano-viewer'));
            expect(orientation.update).toHaveBeenCalled();
        });
    });
});
