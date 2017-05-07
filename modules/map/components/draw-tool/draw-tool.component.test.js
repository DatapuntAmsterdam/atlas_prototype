describe('The draw tool component', function () {
    let $compile,
        $rootScope,
        drawTool,
        store,
        ACTIONS,
        state,
        polygon,
        map,
        onFinishShape,
        onDrawingMode;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: angular.noop
                },
                drawTool: {
                    initialize: (aMap, onFinish, onMode) => {
                        onFinishShape = onFinish;
                        onDrawingMode = onMode;
                    },
                    setPolygon: angular.noop,
                    isEnabled: angular.noop,
                    enable: angular.noop,
                    disable: angular.noop,
                    shape: {
                        markers: [],
                        distanceTxt: 'distance',
                        areaTxt: 'area'
                    }
                }
            });

        state = {};
        polygon = {
            markers: []
        };
        map = {};

        angular.mock.inject(function (_$compile_, _$rootScope_, _drawTool_, _store_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            drawTool = _drawTool_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });
    });

    function getComponent () {
        const element = document.createElement('dp-draw-tool');
        element.setAttribute('state', 'state');
        element.setAttribute('polygon', 'polygon');
        element.setAttribute('map', 'map');

        const scope = $rootScope.$new();
        scope.state = state;
        scope.polygon = polygon;
        scope.map = map;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('The state parameter', function () {
        beforeEach(function () {
            spyOn(drawTool, 'enable');
            spyOn(drawTool, 'disable');
        });

        it('Uses this parameter to follow drawing mode, default is disable', function () {
            getComponent();
            $rootScope.$digest();

            expect(drawTool.enable).not.toHaveBeenCalled();
            expect(drawTool.disable).toHaveBeenCalled();
        });

        it('Uses this parameter to follow drawing mode disable', function () {
            getComponent();
            $rootScope.$digest();

            drawTool.enable.calls.reset();
            drawTool.disable.calls.reset();

            state.drawingMode = null;
            $rootScope.$digest();

            expect(drawTool.enable).not.toHaveBeenCalled();
            expect(drawTool.disable).toHaveBeenCalled();
        });

        it('Uses this parameter to follow drawing mode, not for enable', function () {
            getComponent();
            $rootScope.$digest();

            drawTool.enable.calls.reset();
            drawTool.disable.calls.reset();

            state.drawingMode = 'DRAW';
            $rootScope.$digest();

            expect(drawTool.enable).not.toHaveBeenCalled();
            expect(drawTool.disable).not.toHaveBeenCalled();
        });
    });

    describe('The map parameter', function () {
        beforeEach(function () {
            spyOn(drawTool, 'initialize');
        });

        it('Uses this parameter to initialise the draw tool factory', function () {
            map = {
                aap: 'noot'
            };

            getComponent();
            expect(drawTool.initialize).toHaveBeenCalledWith(map, jasmine.any(Function), jasmine.any(Function));
        });
    });

    describe('The polygon parameter', function () {
        beforeEach(function () {
            spyOn(drawTool, 'setPolygon');
            spyOn(drawTool, 'enable');
            spyOn(drawTool, 'disable');
        });

        it('Informs the draw tool factory of any changes', function () {
            getComponent();

            spyOn(drawTool, 'isEnabled').and.returnValue(false);
            polygon.markers = ['aap'];
            $rootScope.$digest();

            expect(drawTool.setPolygon).toHaveBeenCalledWith(polygon.markers);
        });

        it('Does not informs the draw tool factory when drawing mode is enabled', function () {
            spyOn(drawTool, 'isEnabled').and.returnValue(true);

            getComponent();
            polygon.markers = ['aap'];
            $rootScope.$digest();

            expect(drawTool.setPolygon).not.toHaveBeenCalled();
        });

        it('Does enable drawing mode when state drawing mode is enabled', function () {
            spyOn(drawTool, 'isEnabled').and.returnValue(false);

            getComponent();
            polygon.markers = ['aap'];
            state.drawingMode = 'DRAW';
            $rootScope.$digest();

            expect(drawTool.setPolygon).toHaveBeenCalled();
            expect(drawTool.enable).toHaveBeenCalled();
        });
    });

    describe('The geometry parameter', function () {
        beforeEach(function () {
            spyOn(drawTool, 'setPolygon');
            spyOn(drawTool, 'enable');
            spyOn(drawTool, 'disable');
        });

        it('Informs the draw tool factory of any changes', function () {
            getComponent();

            spyOn(drawTool, 'isEnabled').and.returnValue(false);
            state.geometry = ['aap'];
            $rootScope.$digest();

            expect(drawTool.setPolygon).toHaveBeenCalledWith(state.geometry);
        });

        it('Informs the draw tool factory of any changes, defaults to polygon', function () {
            getComponent();

            spyOn(drawTool, 'isEnabled').and.returnValue(false);
            state.geometry = null;
            $rootScope.$digest();

            expect(drawTool.setPolygon).toHaveBeenCalledWith(polygon.markers);

            drawTool.setPolygon.calls.reset();

            state.geometry = [];
            $rootScope.$digest();

            expect(drawTool.setPolygon).toHaveBeenCalledWith(polygon.markers);
        });
    });

    describe('The dispatched actions', function () {
        beforeEach(function () {
            spyOn(store, 'dispatch');
        });

        it('dispatches a MAP_END_DRAWING action when a polygon is finished and has changed', function () {
            drawTool.shape.markers = [1, 2, 3];
            getComponent();
            onDrawingMode(true);
            polygon.markers = [1, 2, 4];
            onFinishShape(polygon);
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_END_DRAWING,
                payload: {
                    markers: polygon.markers,
                    description: 'distance en area'
                }
            });
        });

        it('does not dispatch a MAP_END_DRAWING action when a polygon is finished and has not changed', function () {
            drawTool.shape.markers = [1, 2, 3];
            getComponent();
            onDrawingMode(true);
            polygon.markers = drawTool.shape.markers;
            onFinishShape(polygon);
            expect(store.dispatch).not.toHaveBeenCalledWith();
        });

        it('Dispatches a MAP_START_DRAWING action when the drawing or editing a polygon starts', function () {
            getComponent();
            const drawingMode = 'aap';
            onDrawingMode(drawingMode);
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_START_DRAWING
            });
        });

        it('Does not dispatch a MAP_START_DRAWING action when the drawing or editing has finished', function () {
            getComponent();
            const drawingMode = null;
            onDrawingMode(drawingMode);
            expect(store.dispatch).not.toHaveBeenCalled();
        });
    });
});
