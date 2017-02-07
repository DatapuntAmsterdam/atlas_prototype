describe('The dp-toggle-drawing-tool component', function () {
    var $compile,
        $rootScope,
        component,
        drawTool;

    const MAXCOUNT = 5;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: angular.noop
                },
                drawTool: {
                    isEnabled: angular.noop,
                    enable: angular.noop,
                    disable: angular.noop,
                    shape: {
                        markers: [],
                        markersMaxCount: MAXCOUNT
                    },
                    setPolygon: angular.noop
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _drawTool_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            drawTool = _drawTool_;
        });

        spyOn(drawTool, 'enable');
        spyOn(drawTool, 'disable');
    });

    function getComponent () {
        var result,
            element,
            scope;

        element = document.createElement('dp-toggle-drawing-tool');
        scope = $rootScope.$new();
        result = $compile(element)(scope);
        scope.$apply();

        return result;
    }

    describe('when inactive', function () {
        beforeEach(function () {
            spyOn(drawTool, 'isEnabled').and.returnValue(false);
            component = getComponent();
        });

        it('shows the button in default state', function () {
            expect(component.find('button').length).toBe(1);
            expect(component.find('button').attr('class')).toContain('c-toggle-drawing-tool');
        });

        it('enables draw/edit mode when clicking the button', function () {
            component.find('button').click();
            expect(drawTool.enable).toHaveBeenCalled();
        });

        it('enables draw/edit mode when clicking the button', function () {
            drawTool.shape.markers = ['aap'];
            spyOn(drawTool, 'setPolygon');

            component.find('button').click();
            expect(drawTool.setPolygon).toHaveBeenCalledWith([]);
            expect(drawTool.enable).toHaveBeenCalled();
        });
    });

    describe('when active', function () {
        beforeEach(function () {
            drawTool.isEnabled = () => true;
            component = getComponent(true);
        });

        it('shows the button in active state with extra label', function () {
            expect(component.find('button').length).toBe(1);
            expect(component.find('button').attr('class')).toContain('c-toggle-drawing-tool--active');
            expect(component.find('button span').attr('class')).not.toContain('ng-hide');
        });

        it('disables drwa/edit mode when clicking the button', function () {
            component.find('button').click();
            expect(drawTool.disable).toHaveBeenCalled();
        });
    });
});
