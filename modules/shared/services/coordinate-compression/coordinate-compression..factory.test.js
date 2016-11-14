describe('The coordinate compression service', function () {
    var coordinateCompression;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_coordinateCompression_) {
            coordinateCompression = _coordinateCompression_;
        });
    });
    fit('can compress lat.lon', function () {
        expect(coordinateCompression.convertCoordinate('3jPEM')).toBe(4.9055812);
    });
    fit('can convert from compressed to uncompressed lat.lon', function () {
        expect(coordinateCompression.convertCoordinate('4.9055812')).toBe('3jPEM');
    });
});
