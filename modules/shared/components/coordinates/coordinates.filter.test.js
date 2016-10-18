describe('The coordinates filter', function () {
    var coordinates;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                crsConverter: {
                    wgs84ToRd: function () {
                        return [123456, 654123];
                    }
                }
            }
        );

        angular.mock.inject(function (_coordinatesFilter_) {
            coordinates = _coordinatesFilter_;
        });
    });

    it('returns a string with the RD and latitude/longitude coordinates', function () {
        expect(coordinates([52.123456, 4.456789])).toBe('123456.00, 654123.00 (52.1234560, 4.4567890)');
    });

    it('rounds latitude and longitude down to 7 decimals', function () {
        expect(coordinates([52.1234565246, 4.4567894123])).toBe('123456.00, 654123.00 (52.1234565, 4.4567894)');
    });
});
