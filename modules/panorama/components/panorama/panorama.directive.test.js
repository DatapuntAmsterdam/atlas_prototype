describe('The dp-panorama directive', function () {
    var $compile,
        $rootScope,
        $store,
        ACTIONS,
        $q,
        marzipanoService,
        orientation,
        mockedMarzipanoViewer;

    
    beforeEach(function () {

        angular.mock.module('dpPanorama', {
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
            panoramaApi: {
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
            ) 
        {
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

    function getDirective(state, isPrintMode) {
        var el = document.createElement('dp-panorama');
        el.setAttribute('state', 'state');
        el.setAttribute('is-print-mode', 'isPrintMode');

        var scope = $rootScope.$new();

        scope.state = state;
        scope.isPrintMode = isPrintMode;

        var directive = $compile(el)(scope);
        scope.$apply();

        return directive;

    }

    describe('Calls to SHOWPANORAMA_INITIAL and SUBSEQUENT', function () {
        it('Does not call SHOW_PANORAMA_INITIAL Or SUBSEQUENT IF State.id is unknown', function () {
            var state = {};

            getDirective(state, false);

            expect($store.dispatch).not.toHaveBeenCalled();

        });
        it('Does call SHOW_PANORAMA_INITIAL', function () {
            var state = {
                id: 'ABC',
                isInitial: true
            };

            getDirective(state, false);

            expect($store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_PANORAMA_INITIAL,
                payload: {
                    foo: 'bar'
                }
            });
        });

        it('Does call SHOW_PANORAMA_SUBSEQUENT', function () {
            var state = {
                id: 'ABC',
                isInitial: false
            };

            getDirective(state, false);

            expect($store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_PANORAMA_SUBSEQUENT,
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

            expect($store.dispatch).toHaveBeenCalledTimes(1);

            directive.isolateScope().state.id = 'XYZ';
            directive.isolateScope().$apply();

            expect($store.dispatch).toHaveBeenCalledTimes(2);
        });



    });



    describe('image state change triggers', function () {

        it('Listens to changes on scope to trigger marzipanoService.loadscene', function () {
            var directive = getDirective({}, false);
            
            expect(marzipanoService.loadScene).not.toHaveBeenCalled();

            directive.isolateScope().state.image = 'http://example.com/example.png';
            directive.isolateScope().$apply();

            expect(marzipanoService.loadScene).toHaveBeenCalledTimes(1);

            directive.isolateScope().state.image = 'http://example.com/example2.png';
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
                image: 'http://example.com/example.png',
                heading: 179,
                pitch: 1,
                fov: 2,
                hotspots: ['a', 'b']
            };

            getDirective(state, false);

            expect(marzipanoService.loadScene).toHaveBeenCalledWith(
                'http://example.com/example.png',
                179,
                1,
                2,
                ['a', 'b']);
        });
    });


    describe('set orientation on mouse move', function(){
        it('calls the orientation factory on mousemove to keep the state in sync', function () {
            var directive;

            directive = getDirective({
                    id: 123,
                    location: [52, 4],
                    heading: 275,
                    pitch: 1,
                    isLoading: false
                }, false
            );

            expect(orientation.update).not.toHaveBeenCalled();

            triggerMousemove(directive.find('.js-marzipano-viewer'));
            
            expect(orientation.update).toHaveBeenCalledWith(
                mockedMarzipanoViewer 
            );
        });
 
        it('doesn\'t call the orientation factory before the scene is done loading', function () {
            var directive,
                mockedState;

            mockedState = {
                id: 'ABC',
                isLoading: true
            };

            //When it is still loading
            directive = getDirective(mockedState, false);
            expect(orientation.update).not.toHaveBeenCalled();

            triggerMousemove(directive.find('.js-marzipano-viewer'));
            expect(orientation.update).not.toHaveBeenCalled();

            //When it is done loading
            mockedState.isLoading = false;
            triggerMousemove(directive.find('.js-marzipano-viewer'));
            expect(orientation.update).toHaveBeenCalled();
        });
    });
});
