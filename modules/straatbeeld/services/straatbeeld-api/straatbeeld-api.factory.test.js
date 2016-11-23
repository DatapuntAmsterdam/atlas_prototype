describe('The straatbeeldApi Factory', function () {
    var straatbeeldApi,
        geojson,
        $q,
        api,
        $rootScope,
        cancel;

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
                getByUrl: function (url, params, _cancel) {
                    cancel = _cancel;

                    let q = $q.defer();

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

    it('calls the API factory with the correct endpoint for id', function () {
        spyOn(api, 'getByUrl').and.callThrough();

        straatbeeldApi.getImageDataById('ABC');

        expect(api.getByUrl).toHaveBeenCalledWith('http://example.com/example/ABC/',
            undefined, jasmine.anything()); // Test the last argument for being a promise lateron
    });

    it('cancels any outstanding call to the API factory when loading a new straatbeeld by id', function () {
        spyOn(api, 'getByUrl').and.callThrough();
        let cancelled = false;

        straatbeeldApi.getImageDataById('ABC');
        cancel.promise.then(() => {
            cancelled = true;
            fail(); // 1 outstanding request should not be cancelled
        });
        $rootScope.$apply();
        expect(cancelled).toBe(false);

        straatbeeldApi.getImageDataById('ABC'); // first request
        cancel.promise.then(() => {
            cancelled = true;
        });
        straatbeeldApi.getImageDataById('ABC'); // second request, first not yet completed
        $rootScope.$apply();
        expect(cancelled).toBe(true);
    });

    it('calls the API factory with the correct endpoint for location', function () {
        spyOn(api, 'getByUrl').and.callThrough();

        straatbeeldApi.getImageDataByLocation([52, 4]);

        expect(api.getByUrl).toHaveBeenCalledWith('http://example.com/example/?lat=52&lon=4&radius=10000',
            undefined, jasmine.anything());
    });

    it('cancels any outstanding call to the API factory when loading a new straatbeeld by loc', function () {
        spyOn(api, 'getByUrl').and.callThrough();
        let cancelled = false;

        straatbeeldApi.getImageDataByLocation([52, 4]);
        cancel.promise.then(() => {
            cancelled = true;
            fail(); // 1 outstanding request should not be cancelled
        });
        $rootScope.$apply();
        expect(cancelled).toBe(false);

        straatbeeldApi.getImageDataByLocation([52, 4]); // first request
        cancel.promise.then(() => {
            cancelled = true;
        });
        straatbeeldApi.getImageDataByLocation([52, 4]); // second request, first not yet completed
        $rootScope.$apply();
        expect(cancelled).toBe(true);
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

        it('maps a geoJSON Point to a location in a custom formatted [lat, lng] Array notation', function () {
            expect(geojson.getCenter).toHaveBeenCalledWith({
                type: 'Point',
                coordinates: [
                    52.3747994036985,
                    4.91359770418102
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
