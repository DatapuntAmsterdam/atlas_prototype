describe('The geojson factory', function () {
    var geojson,
        mockedPoint,
        mockedPolygon,
        mockedPolygonWithHoles,
        mockedMultiPolygon;

    beforeEach(function () {
        angular.mock.module('dpMap');

        angular.mock.inject(function (_geojson_) {
            geojson = _geojson_;
        });

        mockedPoint = {
            type: 'Points',
            coordinates: [100.0, 0.0]
        };

        mockedPolygon = {
            type: 'Polygon',
            coordinates: [
                [
                    [100.0, 0.0], [102.0, 0.0], [102.0, 10.0], [100.0, 10.0], [100.0, 0.0]
                ]
            ]
        };

        mockedPolygonWithHoles = {
            type: 'Polygon',
            coordinates: [
                [
                    [100.0, 0.1], [101.0, 0.1], [101.0, 1.0], [100.0, 1.0], [100.0, 0.1]
                ], [
                    [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]
                ]
            ]
        };

        mockedMultiPolygon = {
            type: 'MultiPolygon',
            coordinates: [
                [
                    [
                        [202.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]
                ], [
                    [
                        [100.0, 0.0], [101.0, 90.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]
                    ], [
                        [100.2, 0.2], [100.8, 0.2], [100.8, 90.3], [100.2, 0.8], [100.2, 0.2]
                    ]
                ]
            ]
        };
    });

    it('can transform a Point to an Array format', function () {
        expect(geojson.getCenter(mockedPoint)).toEqual([100.0, 0.0]);
    });

    it('can calculate the center of a Polygon', function () {
        expect(geojson.getCenter(mockedPolygon)).toEqual([101.0, 5.0]);
        expect(geojson.getCenter(mockedPolygonWithHoles)).toEqual([100.5, 0.55]);
    });

    it('can calculate the center of a MultiPolygon', function () {
        expect(geojson.getCenter(mockedMultiPolygon)).toEqual([151.0, 45.15]);
    });
});