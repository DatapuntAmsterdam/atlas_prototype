describe('The crsService', function () {
    var crsService,
        CRS_CONFIG;

    beforeEach(function () {
        angular.mock.module('dpShared', {
            CRS_CONFIG: {
                RD: {
                    code: 'a',
                    projection: 'b',
                    transformation: {
                        bounds: 'c'
                    }
                },
                WGS84: {
                    code: 'd'
                },
                EARTH_RADIUS: 123456789
            }
        });

        angular.mock.inject(function (_crsService_, _CRS_CONFIG_) {
            crsService = _crsService_;
            CRS_CONFIG = _CRS_CONFIG_;
        });
    });

    it('may not alter the configuration source', function () {
        // This specification solves ATLAS-1101
        var originalConfig = angular.copy(CRS_CONFIG);

        crsService.getRd();
        expect(CRS_CONFIG).toEqual(originalConfig);

        crsService.getRdObject();
        expect(CRS_CONFIG).toEqual(originalConfig);
    });
});
