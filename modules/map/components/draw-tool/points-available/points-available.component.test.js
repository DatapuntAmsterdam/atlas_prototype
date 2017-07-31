describe('The dp-points-available component', () => {
    var $compile,
        $rootScope,
        scope,
        drawTool,
        DRAW_TOOL_CONFIG;

    beforeEach(() => {
        angular.mock.module(
            'dpMap',
            {
                drawTool: {
                    isEnabled: angular.noop,
                    shape: {
                        markersMaxCount: 10,
                        markers: []
                    }
                }
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _drawTool_, _DRAW_TOOL_CONFIG_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            drawTool = _drawTool_;
            DRAW_TOOL_CONFIG = _DRAW_TOOL_CONFIG_;
        });
    });

    function getComponent () {
        const element = document.createElement('dp-points-available');

        scope = $rootScope.$new();
        const result = $compile(element)(scope);

        scope.$apply();

        return result;
    }

    describe('When the draw tool is enabled', () => {
        beforeEach(() => {
            spyOn(drawTool, 'isEnabled').and.returnValue(true);
        });

        it('shows the remaining number of markers only when less than X markers left', () => {
            drawTool.shape.markers = [];
            const component = getComponent();
            for (let i = 0; i < drawTool.shape.markersMaxCount; i++) {
                const markersLeft = drawTool.shape.markersMaxCount - drawTool.shape.markers.length;
                const showWarning = markersLeft <= DRAW_TOOL_CONFIG.MARKERS_LEFT_WARNING;
                if (showWarning) {
                    expect(component.find('.qa-few-points-available').length).toBe(1);
                    expect(component.find('.qa-few-points-available').text()).toContain(
                        'Nog ' + markersLeft + ' punt' + (markersLeft !== 1 ? 'en' : '') + ' mogelijk');
                } else {
                    expect(component.find('.qa-few-points-available').length).toBe(0);
                }

                drawTool.shape.markers.push(i);
                $rootScope.$digest();
            }
        });

        it('shows no markers available when 0 markers left', () => {
            drawTool.shape.markers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const component = getComponent();
            expect(component.find('.qa-few-points-available').length).toBe(0);
            expect(component.find('.qa-no-more-points-available').length).toBe(1);
            expect(component.find('.qa-no-more-points-available').text()).toContain(
                'Geen punten mogelijk'
            );
        });
    });

    describe('When the draw tool is disabled', () => {
        beforeEach(() => {
            spyOn(drawTool, 'isEnabled').and.returnValue(false);
        });

        it('shows nothing', () => {
            drawTool.shape.markers = [];
            const component = getComponent();
            for (let i = 0; i < drawTool.shape.markersMaxCount; i++) {
                expect(component.find('.qa-few-points-available').length).toBe(0);
                expect(component.find('.qa-no-more-points-available').length).toBe(0);
                drawTool.shape.markers.push(i);
                $rootScope.$digest();
            }
            expect(component.find('.qa-few-points-available').length).toBe(0);
            expect(component.find('.qa-no-more-points-available').length).toBe(0);
        });
    });
});
