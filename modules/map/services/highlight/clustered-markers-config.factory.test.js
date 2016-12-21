describe('The clusteredMarkersConfig factory', function () {
    let clusteredMarkersConfig,
        mockedCluster,
        L;

    beforeEach(function () {
        angular.mock.module('dpMap');

        angular.mock.inject(function (_clusteredMarkersConfig_, _L_) {
            clusteredMarkersConfig = _clusteredMarkersConfig_;
            L = _L_;
        });

        mockedCluster = {
            getChildCount: function () {
                return 123;
            }
        };

        spyOn(L, 'divIcon').and.returnValue('MOCKED_DIV_ICON');
    });

    it('has an iconCreateFunction that returns a Leaflet icon with custom HTML', function () {
        const icon = clusteredMarkersConfig.iconCreateFunction(mockedCluster);

        expect(icon).toBe('MOCKED_DIV_ICON');
        expect(L.divIcon).toHaveBeenCalledWith(jasmine.objectContaining({
            html: '<div class="o-highlight-cluster__text">123</div>',
            className: 'o-highlight-cluster'
        }));
    });
});
