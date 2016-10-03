describe('The hotspotService', function () {
    var $rootScope,
        hotspotService;

    beforeEach(function () {
        angular.mock.module(
            'dpPanorama',
            function ($provide) {
                $provide.factory('dpHotspotDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$rootScope_, _hotspotService_) {
            $rootScope = _$rootScope_;
            hotspotService = _hotspotService_;
        });
    });

    it('creates hotspot HTML', function () {
        hotspotService.createHotspotTemplate(789, 15).then(function (template) {
            var html = template.outerHTML,
                scope = angular.element(template).scope();

            expect(html).toContain('<dp-hotspot scene-id="sceneId" distance="distance"');
            expect(scope.sceneId).toBe(789);
            expect(scope.distance).toBe(15);
        });

        $rootScope.$apply();
    });
});
