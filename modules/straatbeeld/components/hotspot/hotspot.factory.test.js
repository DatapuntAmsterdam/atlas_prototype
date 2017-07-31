describe('The hotspotService', () => {
    var $rootScope,
        hotspotService;

    beforeEach(() => {
        angular.mock.module(
            'dpStraatbeeld',
            $provide => {
                $provide.factory('dpHotspotDirective', () => ({}));
            }
        );

        angular.mock.inject((_$rootScope_, _hotspotService_) => {
            $rootScope = _$rootScope_;
            hotspotService = _hotspotService_;
        });
    });

    it('creates hotspot HTML', () => {
        hotspotService.createHotspotTemplate(789, 15, 0.29, 2016).then(template => {
            var html = template.outerHTML,
                scope = angular.element(template).scope();

            expect(html).toContain('<dp-hotspot scene-id="sceneId" distance="distance" pitch="pitch" year="year"');
            expect(scope.sceneId).toBe(789);
            expect(scope.distance).toBe(15);
            expect(scope.pitch).toBe(0.29);
            expect(scope.year).toBe(2016);
        });

        $rootScope.$apply();
    });
});
