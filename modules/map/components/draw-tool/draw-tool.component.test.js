describe('The draw tool component', () => {
    let $compile,
        $rootScope,
        drawTool,
        store,
        ACTIONS,
        state,
        polygon,
        map,
        onFinishShape,
        onDrawingMode,
        DRAW_TOOL_CONFIG;

    beforeEach(() => {
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
                    cancel: angular.noop,
                    shape: {
                        markers: [],
                        distanceTxt: 'distance',
                        areaTxt: 'area'
                    }
                }
            });

        polygon = {
            markers: []
        };
        map = {};

        angular.mock.inject((
            _$compile_,
            _$rootScope_,
            _drawTool_,
            _store_,
            _ACTIONS_,
            _DRAW_TOOL_CONFIG_
        ) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            drawTool = _drawTool_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            DRAW_TOOL_CONFIG = _DRAW_TOOL_CONFIG_;
        });

        state = {
            drawingMode: DRAW_TOOL_CONFIG.DRAWING_MODE.NONE
        };
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

    describe('The state parameter', () => {
        beforeEach(() => {
            spyOn(drawTool, 'enable');
            spyOn(drawTool, 'disable');
            spyOn(drawTool, 'cancel');
        });

        it('Uses this parameter to follow drawing mode, default none should trigger cancel', () => {
            getComponent();
            $rootScope.$digest();

            expect(drawTool.enable).not.toHaveBeenCalled();
            expect(drawTool.disable).not.toHaveBeenCalled();
            expect(drawTool.cancel).toHaveBeenCalled();
        });

        it('Uses this parameter to follow drawing mode: draw should enable drawing', () => {
            state.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW;
            getComponent();
            $rootScope.$digest();

            expect(drawTool.enable).toHaveBeenCalled();
            expect(drawTool.disable).not.toHaveBeenCalled();
            expect(drawTool.cancel).not.toHaveBeenCalled();
        });

        it('Uses this parameter to follow drawing mode: edit should enable drawing', () => {
            state.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.EDIT;
            getComponent();
            $rootScope.$digest();

            expect(drawTool.enable).toHaveBeenCalled();
            expect(drawTool.disable).not.toHaveBeenCalled();
            expect(drawTool.cancel).not.toHaveBeenCalled();
        });
    });

    describe('The map parameter', () => {
        beforeEach(() => {
            spyOn(drawTool, 'initialize');
        });

        it('Uses this parameter to initialise the draw tool factory', () => {
            map = {
                aap: 'noot'
            };

            getComponent();
            expect(drawTool.initialize).toHaveBeenCalledWith(map, jasmine.any(Function), jasmine.any(Function));
        });
    });

    describe('The polygon parameter', () => {
        beforeEach(() => {
            spyOn(drawTool, 'setPolygon');
            spyOn(drawTool, 'enable');
            spyOn(drawTool, 'disable');
        });

        it('Informs the draw tool factory of any changes', () => {
            getComponent();

            spyOn(drawTool, 'isEnabled').and.returnValue(false);
            polygon.markers = ['aap'];
            $rootScope.$digest();

            expect(drawTool.setPolygon).toHaveBeenCalledWith(polygon.markers);
        });

        it('Does not informs the draw tool factory when drawing mode is enabled', () => {
            spyOn(drawTool, 'isEnabled').and.returnValue(true);

            getComponent();
            polygon.markers = ['aap'];
            $rootScope.$digest();

            expect(drawTool.setPolygon).not.toHaveBeenCalled();
        });

        it('Does enable drawing mode when state drawing mode is enabled', () => {
            spyOn(drawTool, 'isEnabled').and.returnValue(false);

            getComponent();
            polygon.markers = ['aap'];
            state.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW;
            $rootScope.$digest();

            expect(drawTool.setPolygon).toHaveBeenCalled();
            expect(drawTool.enable).toHaveBeenCalled();
        });
    });

    describe('The geometry parameter', () => {
        beforeEach(() => {
            spyOn(drawTool, 'setPolygon');
            spyOn(drawTool, 'enable');
            spyOn(drawTool, 'disable');
        });

        it('Informs the draw tool factory of any changes', () => {
            getComponent();

            spyOn(drawTool, 'isEnabled').and.returnValue(false);
            state.geometry = ['aap'];
            $rootScope.$digest();

            expect(drawTool.setPolygon).toHaveBeenCalledWith(state.geometry);
        });

        it('Informs the draw tool factory of any changes, defaults to polygon', () => {
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

    describe('The dispatched actions', () => {
        beforeEach(() => {
            spyOn(store, 'dispatch');
        });

        it('dispatches a MAP_END_DRAWING action when a polygon is finished and has changed', () => {
            drawTool.shape.markers = [1, 2, 3];
            getComponent();
            onDrawingMode(DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW);
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

        it('does not dispatch a MAP_END_DRAWING action when a polygon is finished and has not changed', () => {
            drawTool.shape.markers = [1, 2, 3];
            getComponent();
            onDrawingMode(DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW);
            polygon.markers = drawTool.shape.markers;
            onFinishShape(polygon);
            expect(store.dispatch).not.toHaveBeenCalledWith();
        });

        it('Dispatches a MAP_START_DRAWING action when the drawing starts', () => {
            getComponent();
            onDrawingMode(DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW);
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_START_DRAWING,
                payload: DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW
            });
        });

        it('Dispatches a MAP_END_DRAWING action without payload when the drawing mode is changed to `none`', () => {
            getComponent();
            onDrawingMode(DRAW_TOOL_CONFIG.DRAWING_MODE.NONE);
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_END_DRAWING
            });
        });
    });
});
