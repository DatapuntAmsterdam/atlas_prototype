describe('The dp-shape-summary component', () => {
    var $compile,
        $rootScope,
        scope,
        store,
        ACTIONS,
        drawTool;

    beforeEach(() => {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: angular.noop
                },
                drawTool: {
                    isEnabled: angular.noop,
                    shape: {
                        markers: [],
                        distanceTxt: 'distance',
                        areaTxt: 'area'
                    }
                }
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _ACTIONS_, _drawTool_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            drawTool = _drawTool_;
        });
    });

    function getComponent () {
        const element = document.createElement('dp-shape-summary');

        scope = $rootScope.$new();
        const result = $compile(element)(scope);

        scope.$apply();

        return result;
    }

    describe('When the draw tool is enabled', () => {
        beforeEach(() => {
            spyOn(drawTool, 'isEnabled').and.returnValue(true);
        });

        it('shows nothing', () => {
            drawTool.shape.markers = [1, 2, 3];
            const component = getComponent();
            expect(component.find('.qa-summary-available').length).toBe(0);
        });
    });

    describe('When the draw tool is disabled', () => {
        beforeEach(() => {
            spyOn(drawTool, 'isEnabled').and.returnValue(false);
        });

        it('shows a summary for a line', () => {
            drawTool.shape.markers = [1, 2];
            const component = getComponent();
            expect(component.find('.qa-summary-available').length).toBe(1);
        });

        it('shows a remove geometry button for a line', () => {
            drawTool.shape.markers = [1, 2];
            const component = getComponent();
            expect(component.find('.qa-summary-remove-geometry').length).toBe(1);
        });

        it('removes a geometry when the remove geometry button is clicked', () => {
            drawTool.shape.markers = [1, 2];
            const component = getComponent();

            spyOn(store, 'dispatch');
            component.find('.qa-summary-available').find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_CLEAR_DRAWING
            });
        });

        it('doesn\'t show a summary for polygons', () => {
            drawTool.shape.markers = [1, 2, 3];
            const component = getComponent();
            expect(component.find('.qa-summary-available').length).toBe(0);
        });
    });
});
