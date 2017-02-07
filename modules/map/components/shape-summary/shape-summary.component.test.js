describe('The dp-shape-summary component', function () {
    var $compile,
        $rootScope,
        scope,
        store,
        ACTIONS,
        drawTool;

    beforeEach(function () {
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

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_, _drawTool_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            drawTool = _drawTool_;
        });
    });

    function getComponent () {
        let element = document.createElement('dp-shape-summary');

        scope = $rootScope.$new();
        let result = $compile(element)(scope);

        scope.$apply();

        return result;
    }

    describe('When the draw tool is enabled', function () {
        beforeEach(function () {
            spyOn(drawTool, 'isEnabled').and.returnValue(true);
        });

        it('shows nothing', function () {
            drawTool.shape.markers = [1, 2, 3];
            let component = getComponent();
            expect(component.find('.qa-summary-available').length).toBe(0);
        });
    });

    describe('When the draw tool is disabled', function () {
        beforeEach(function () {
            spyOn(drawTool, 'isEnabled').and.returnValue(false);
        });

        it('shows a summary for a line', function () {
            drawTool.shape.markers = [1, 2];
            let component = getComponent();
            expect(component.find('.qa-summary-available').length).toBe(1);
        });

        it('shows a remove geometry button for a line', function () {
            drawTool.shape.markers = [1, 2];
            let component = getComponent();
            expect(component.find('.qa-summary-remove-geometry').length).toBe(1);
        });

        it('removes a geometry when the remove geometry button is clicked', function () {
            drawTool.shape.markers = [1, 2];
            let component = getComponent();

            spyOn(store, 'dispatch');
            component.find('.qa-summary-available').find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_CLEAR_DRAWING
            });
        });

        it('doesn\'t show a summary for polygons', function () {
            drawTool.shape.markers = [1, 2, 3];
            let component = getComponent();
            expect(component.find('.qa-summary-available').length).toBe(0);
        });
    });
});
