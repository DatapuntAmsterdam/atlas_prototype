describe('The straatbeeldApi Factory', function () {
    var straatbeeldApi,
        geojson,
        $q,
        api,
        $rootScope;

    beforeEach(function () {
        angular.mock.module('dpStraatbeeld', {
            straatbeeldConfig: {
                STRAATBEELD_ENDPOINT: 'http://example.com/example/'
            },
            sharedConfig: {
                RADIUS: 100
            },
            geojson: {
                getCenter: function () {
                    return [52.3747994036985, 4.91359770418102];
                }
            },
            api: {
                getByUrl: function () {
                    var q = $q.defer();

                    q.resolve({
                        image_sets: {
                            cubic: {
                                pattern: 'http://example.com/example/cubic/abf123/{a}/{b}/{c}.jpg',
                                preview: 'http://example.com/example/cubic/abf123/preview.jpg'
                            }
                        },
                        geometrie: {
                            type: 'Point',
                            coordinates: [
                                4.91359770418102,
                                52.3747994036985,
                                46.9912552172318
                            ]
                        },
                        adjacent: [{
                            pano_id: 'TMX7315120208-000054_pano_0002_000177',
                            heading: 116.48,
                            distance: 10.14
                        },
                        {
                            pano_id: 'TMX7315120208-000054_pano_0002_000178',
                            heading: 127.37,
                            distance: 5.25
                        }],
                        timestamp: '2016-05-19T13:04:15.341110Z'
                    });

                    return q.promise;
                }
            }
        });

        angular.mock.inject(function (_straatbeeldApi_, _geojson_, _$q_, _api_, _$rootScope_) {
            straatbeeldApi = _straatbeeldApi_;
            geojson = _geojson_;
            $q = _$q_;
            api = _api_;
            $rootScope = _$rootScope_;
        });
    });

    it('calls the API factory with the correct endpoint', function () {
        spyOn(api, 'getByUrl').and.callThrough();

        straatbeeldApi.getImageDataById('ABC');

        expect(api.getByUrl).toHaveBeenCalledWith('http://example.com/example/ABC/');
    });

    describe('the API will be mapped to the state structure', function () {
        var response;

        beforeEach(function () {
            spyOn(geojson, 'getCenter').and.callThrough();

            straatbeeldApi.getImageDataById('ABC').then(function (_response_) {
                response = _response_;
            });

            $rootScope.$apply();
        });

        it('converts date string to Javascript date format', function () {
            expect(response.date).toEqual(new Date('2016-05-19T13:04:15.341110Z'));
        });

        it('maps hotspot data to proper subset', function () {
            expect(response.hotspots).toEqual(
                [{
                    id: 'TMX7315120208-000054_pano_0002_000177',
                    heading: 116.48,
                    distance: 10.14
                }, {
                    id: 'TMX7315120208-000054_pano_0002_000178',
                    heading: 127.37,
                    distance: 5.25
                }]
            );
        });

        it('maps a geoJSON Point to a location in [lat, lng] Array notation', function () {
            expect(geojson.getCenter).toHaveBeenCalledWith({
                type: 'Point',
                coordinates: [
                    4.91359770418102,
                    52.3747994036985,
                    46.9912552172318
                ]
            });

            expect(response.location).toEqual([52.3747994036985, 4.91359770418102]);
        });

        it('fetches the cubic image', function () {
            expect(response.image).toEqual({
                pattern: 'http://example.com/example/cubic/abf123/{a}/{b}/{c}.jpg',
                preview: 'http://example.com/example/cubic/abf123/preview.jpg'
            });
        });
    });
});
