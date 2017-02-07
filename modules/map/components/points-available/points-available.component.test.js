describe('The dp-points-available component', function () {
    var $compile,
        $rootScope,
        scope,
        drawTool;

    beforeEach(function () {
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

        angular.mock.inject(function (_$compile_, _$rootScope_, _drawTool_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            drawTool = _drawTool_;
        });
    });

    function getComponent () {
        let element = document.createElement('dp-points-available');

        scope = $rootScope.$new();
        let result = $compile(element)(scope);

        scope.$apply();

        return result;
    }

    describe('When the draw tool is enabled', function () {
        beforeEach(function () {
            spyOn(drawTool, 'isEnabled').and.returnValue(true);
        });

        it('shows the remaining number of markers only when less than X markers left', function () {
            drawTool.shape.markers = [];
            let component = getComponent();
            for (let i = 0; i < drawTool.shape.markersMaxCount; i++) {
                let markersLeft = drawTool.shape.markersMaxCount - drawTool.shape.markers.length;
                let showWarning = markersLeft <= 5;
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
            expect(component.find('.qa-few-points-available').length).toBe(0);
            expect(component.find('.qa-no-more-points-available').length).toBe(1);
            expect(component.find('.qa-no-more-points-available').text()).toContain(
                'Geen punten mogelijk'
            );
        });
    });

    describe('When the draw tool is disabled', function () {
        beforeEach(function () {
            spyOn(drawTool, 'isEnabled').and.returnValue(false);
        });

        it('shows nothing', function () {
            drawTool.shape.markers = [];
            let component = getComponent();
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
