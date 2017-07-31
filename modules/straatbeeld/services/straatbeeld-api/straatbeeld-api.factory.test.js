describe('The straatbeeldApi Factory', () => {
    var straatbeeldApi,
        geojson,
        $q,
        api,
        $rootScope,
        cancel,
        searchSteps;

    searchSteps = [1000, 2000, 4000, 8000, 10000];

    beforeEach(() => {
        angular.mock.module(
            'dpStraatbeeld',
            {
                sharedConfig: {
                    API_ROOT: 'http://pano.amsterdam.nl/',
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

                        const q = $q.defer();

                        q.resolve({
                            image_sets: {
                                cubic: {
                                    pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                                    preview: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
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
                                distance: 10.14,
                                year: 2016
                            },
                            {
                                pano_id: 'TMX7315120208-000054_pano_0002_000178',
                                heading: 127.37,
                                distance: 5.25,
                                year: 2017
                            }],
                            timestamp: '2016-05-19T13:04:15.341110Z'
                        });

                        return q.promise;
                    }
                }
            },
            $provide => {
                $provide.constant('STRAATBEELD_CONFIG', {
                    STRAATBEELD_ENDPOINT_ALL: 'all/',
                    STRAATBEELD_ENDPOINT_YEAR: 'year/'
                });
            }
        );

        angular.mock.inject((_straatbeeldApi_, _geojson_, _$q_, _api_, _$rootScope_) => {
            straatbeeldApi = _straatbeeldApi_;
            geojson = _geojson_;
            $q = _$q_;
            api = _api_;
            $rootScope = _$rootScope_;
        });
    });

    it('calls the API factory with the correct endpoint for id', () => {
        spyOn(api, 'getByUrl').and.callThrough();

        straatbeeldApi.getImageDataById('ABC');

        expect(api.getByUrl).toHaveBeenCalledWith('http://pano.amsterdam.nl/all/ABC/',
            undefined, jasmine.anything()); // Test the last argument for being a promise lateron
    });

    it('cancels any outstanding call to the API factory when loading a new straatbeeld by id', () => {
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

    it('calls the API factory with the correct endpoint for location', () => {
        spyOn(api, 'getByUrl').and.callThrough();

        straatbeeldApi.getImageDataByLocation([52, 4]);

        expect(api.getByUrl).toHaveBeenCalledWith('http://pano.amsterdam.nl/all/?lat=52&lon=4&radius=1000',
            undefined, jasmine.anything());
    });

    it('keeps calling the API factory until a straatbeeld is found', () => {
        spyOn(api, 'getByUrl').and.callFake(url => {
            const defer = $q.defer();
            if (url.includes('radius=10000')) {
                defer.resolve({
                    geometrie: {
                        type: 'aap',
                        coordinates: [1, 2]
                    },
                    adjacent: [],
                    image_sets: {}
                });
            } else {
                defer.resolve({});
            }
            return defer.promise;
        });

        straatbeeldApi.getImageDataByLocation([52, 4]);

        searchSteps.forEach(n => {
            $rootScope.$apply();
            expect(api.getByUrl).toHaveBeenCalledWith(
                `http://pano.amsterdam.nl/all/?lat=52&lon=4&radius=${n}`,
                undefined,
                jasmine.anything()
            );
        });
    });

    it('stops calling the API factory when no straatbeeld is found within 10km and then returns null', () => {
        spyOn(api, 'getByUrl').and.callFake(url => {
            const defer = $q.defer();
            defer.resolve({});
            return defer.promise;
        });

        let result;
        let failed = false;
        straatbeeldApi.getImageDataByLocation([52, 4]).then(
            data => result = data,
            () => failed = true
        );

        searchSteps.forEach(n => {
            $rootScope.$apply();
            expect(api.getByUrl).toHaveBeenCalledWith(
                `http://pano.amsterdam.nl/all/?lat=52&lon=4&radius=${n}`,
                undefined,
                jasmine.anything()
            );
        });

        $rootScope.$apply();
        expect(failed).toBe(false); // No rejection
        expect(result).toBeNull();  // But return null value
    });

    it('cancels any outstanding call to the API factory when loading a new straatbeeld by loc', () => {
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

    describe('the API will be mapped to the state structure', () => {
        var response;

        beforeEach(() => {
            spyOn(geojson, 'getCenter').and.callThrough();

            straatbeeldApi.getImageDataById('ABC').then(_response_ => {
                response = _response_;
            });

            $rootScope.$apply();
        });

        it('converts date string to Javascript date format', () => {
            expect(response.date).toEqual(new Date('2016-05-19T13:04:15.341110Z'));
        });

        it('maps hotspot data to proper subset', () => {
            expect(response.hotspots).toEqual(
                [{
                    id: 'TMX7315120208-000054_pano_0002_000177',
                    heading: 116.48,
                    distance: 10.14,
                    year: 2016
                }, {
                    id: 'TMX7315120208-000054_pano_0002_000178',
                    heading: 127.37,
                    distance: 5.25,
                    year: 2017
                }]
            );
        });

        it('maps a geoJSON Point to a location in a custom formatted [lat, lng] Array notation', () => {
            expect(geojson.getCenter).toHaveBeenCalledWith({
                type: 'Point',
                coordinates: [
                    52.3747994036985,
                    4.91359770418102
                ]
            });

            expect(response.location).toEqual([52.3747994036985, 4.91359770418102]);
        });

        it('fetches the cubic image', () => {
            expect(response.image).toEqual({
                pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                preview: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
            });
        });
    });

    describe('the history selection', () => {
        beforeEach(() => {
            spyOn(api, 'getByUrl').and.callThrough();
        });

        it('will make \'getImageDataByLocation\' use another endpoint', () => {
            straatbeeldApi.getImageDataByLocation([52, 4], 2020);

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/year/2020/?lat=52&lon=4&radius=1000',
                undefined,
                jasmine.anything()
            );
        });

        it('will make \'getImageDataById\' use another endpoint', () => {
            straatbeeldApi.getImageDataById('ABC', 2020);

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/year/2020/ABC/',
                undefined,
                jasmine.anything()
            );
        });

        it('will not change the endpoint when falsy', () => {
            straatbeeldApi.getImageDataByLocation([52, 4], 0);

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/all/?lat=52&lon=4&radius=1000',
                undefined,
                jasmine.anything()
            );

            api.getByUrl.calls.reset();

            straatbeeldApi.getImageDataById('ABC', 0);

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/all/ABC/',
                undefined,
                jasmine.anything()
            );
        });
    });
});
