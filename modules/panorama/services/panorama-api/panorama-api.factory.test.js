describe('Panorama API Factory', function () {

    var panoramaApi,
        geojson,
        $q,
        api,
        $rootScope;


    beforeEach(function () {
        
        angular.mock.module('dpPanorama', {
            panoramaConfig: {
                PANORAMA_ENDPOINT: 'http://example.com/example/'
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
                        images: {
                            equirectangular: 'http://example.com/example/plaatje.png'
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

        angular.mock.inject(function (_panoramaApi_, _geojson_, _$q_, _api_, _$rootScope_) {
            panoramaApi = _panoramaApi_;
            geojson = _geojson_;
            $q = _$q_;
            api = _api_;
            $rootScope = _$rootScope_;
        });

    });

    it('Calls HTTP get with custom URL and parameters', function () {
        spyOn(api, 'getByUrl').and.callThrough();

        panoramaApi.getImageDataById('ABC');

        expect(api.getByUrl).toHaveBeenCalledWith('http://example.com/example/ABC/', {
            radius: 100
        });
    });

    describe('restructures API response', function () {

        var response;

        beforeEach(function () {
            spyOn(geojson, 'getCenter').and.callThrough();

            panoramaApi.getImageDataById('ABC').then(function (_response_) {
                response = _response_;
            });

            $rootScope.$apply();
         
        });

        it('converts date string to Javascript date format', function () {
            expect(response.date).toEqual(new Date('2016-05-19T13:04:15.341110Z'));


        });
        it('maps hotspot data to proper subset', function () {
            expect(response.hotspots).toEqual([{
                id: 'TMX7315120208-000054_pano_0002_000177',
                heading: 116.48,
                distance: 10.14
            }, {
                    id: 'TMX7315120208-000054_pano_0002_000178',
                    heading: 127.37,
                    distance: 5.25
                }]);

        });
        it('maps geoJson point to lat/lon notation', function () {

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

        it('fetches equirectangular image', function () {
            expect(response.image).toBe('http://example.com/example/plaatje.png');
        });
    });
});