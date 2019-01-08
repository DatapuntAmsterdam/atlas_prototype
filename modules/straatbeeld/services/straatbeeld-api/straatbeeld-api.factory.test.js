describe('The straatbeeldApi Factory', () => {
    let straatbeeldApi,
        geojson,
        $q,
        api,
        $rootScope,
        cancel;

    beforeEach(() => {
        angular.mock.module(
            'dpStraatbeeld',
            {
                sharedConfig: {
                    API_ROOT: 'http://pano.amsterdam.nl/',
                    RADIUS: 100
                },
                geojson: {
                    getCenter: () => {
                        return [52.3747994036985, 4.91359770418102];
                    }
                },
                api: {
                    getByUrl: function (url, params, _cancel) {
                        cancel = _cancel;

                        const q = $q.defer();

                        if (url.includes('near=1,1') && url.includes('newest_in_range=true')) {
                            q.resolve({
                                _embedded: {
                                    panoramas: []
                                }
                            });
                        } else if (url.includes('near=1,1')) {
                            q.resolve({
                                _embedded: {
                                    panoramas: [{
                                        pano_id: 'TMX7315120208-000054_pano_0002_000177',
                                        direction: 116.48,
                                        distance: 10.14,
                                        year: 2016,
                                        cubic_img_baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
                                        cubic_img_pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [
                                                4.91359770418102,
                                                52.3747994036985,
                                                46.9912552172318
                                            ]
                                        },
                                        timestamp: '2016-05-19T13:04:15.341110Z',
                                        _links: {
                                            adjacencies: 'http://pano.amsterdam.nl',
                                            cubic_img_preview: {
                                                href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
                                            }
                                        }
                                    }]
                                }
                            });
                        } else {
                            q.resolve({
                                _embedded: {
                                    adjacencies: [{
                                        pano_id: 'TMX7315120208-000054_pano_0002_000177',
                                        direction: 116.48,
                                        distance: 10.14,
                                        mission_year: 2016,
                                        cubic_img_baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
                                        cubic_img_pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [
                                                4.91359770418102,
                                                52.3747994036985,
                                                46.9912552172318
                                            ]
                                        },
                                        timestamp: '2016-05-19T13:04:15.341110Z',
                                        _links: {
                                            cubic_img_preview: {
                                                href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
                                            }
                                        }
                                    },
                                    {
                                        pano_id: 'TMX7315120208-000054_pano_0002_000178',
                                        direction: 127.37,
                                        distance: 5.25,
                                        mission_year: 2017,
                                        cubic_img_baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
                                        cubic_img_pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [
                                                4.91359770418102,
                                                52.3747994036985,
                                                46.9912552172318
                                            ]
                                        },
                                        timestamp: '2017-05-19T13:04:15.341110Z',
                                        _links: {
                                            cubic_img_preview: {
                                                href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
                                            }
                                        }
                                    }],
                                    panoramas: [
                                        {
                                            pano_id: 'TMX7315120208-000054_pano_0002_000177',
                                            direction: 116.48,
                                            distance: 10.14,
                                            mission_year: 2016,
                                            cubic_img_baseurl:
                                                'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
                                            cubic_img_pattern:
                                                'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                                            geometry: {
                                                type: 'Point',
                                                coordinates: [
                                                    4.91359770418102,
                                                    52.3747994036985,
                                                    46.9912552172318
                                                ]
                                            },
                                            timestamp: '2016-05-19T13:04:15.341110Z',
                                            _links: {
                                                adjacencies: 'http://pano.amsterdam.nl',
                                                cubic_img_preview: {
                                                    href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
                                                }
                                            }
                                        },
                                        {
                                            pano_id: 'TMX7315120208-000054_pano_0002_000178',
                                            direction: 127.37,
                                            distance: 5.25,
                                            mission_year: 2017,
                                            cubic_img_baseurl:
                                                'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
                                            cubic_img_pattern:
                                                'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                                            geometry: {
                                                type: 'Point',
                                                coordinates: [
                                                    4.91359770418102,
                                                    52.3747994036985,
                                                    46.9912552172318
                                                ]
                                            },
                                            timestamp: '2017-05-19T13:04:15.341110Z',
                                            _links: {
                                                adjacencies: 'http://pano.amsterdam.nl',
                                                cubic_img_preview: {
                                                    href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
                                                }
                                            }
                                        }
                                    ],
                                    _links: {
                                        href: 'http://pano.amsterdam.nl'
                                    }
                                }
                            });
                        }

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.constant('STRAATBEELD_CONFIG', {
                    STRAATBEELD_ENDPOINT_PREFIX: 'panorama/panoramas',
                    STRAATBEELD_ENDPOINT_SUFFIX: 'adjacencies',
                    MAX_RADIUS: 250,
                    LARGE_RADIUS: 100000,
                    SRID: 4326
                });
            }
        );

        angular.mock.inject(function (_straatbeeldApi_, _geojson_, _$q_, _api_, _$rootScope_) {
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

        expect(api.getByUrl).toHaveBeenCalledWith(
            'http://pano.amsterdam.nl/panorama/panoramas/ABC/adjacencies/?newest_in_range=true',
            undefined,
            jasmine.anything()
        );
    });

    it('calls the API factory with the correct endpoint for id with history', () => {
        spyOn(api, 'getByUrl').and.callThrough();

        straatbeeldApi.getImageDataById('ABC', { year: 2017, missionType: 'woz' });

        expect(api.getByUrl).toHaveBeenCalledWith(
            'http://pano.amsterdam.nl/panorama/panoramas/ABC/adjacencies/' +
            '?newest_in_range=true&mission_year=2017&mission_type=woz',
            undefined,
            jasmine.anything()
        );
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

    describe('calls the API factory with the correct endpoint for location', () => {
        beforeEach(() => {
            spyOn(api, 'getByUrl').and.callThrough();
        });

        it('with geolocation', () => {
            straatbeeldApi.getImageDataByLocation([52, 4]);

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/panorama/panoramas/' +
                '?near=4,52&srid=4326&page_size=1&radius=250&newest_in_range=true&limit_results=1',
                undefined,
                jasmine.anything()
            );
        });

        it('with geolocation and history', () => {
            straatbeeldApi.getImageDataByLocation([52, 4], { year: 2017 });

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/panorama/panoramas/' +
                '?near=4,52&srid=4326&page_size=1&mission_year=2017' +
                '&radius=250&newest_in_range=true&limit_results=1',
                undefined,
                jasmine.anything()
            );

            straatbeeldApi.getImageDataByLocation([52, 4], { year: 2017, missionType: 'ABC' });

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/panorama/panoramas/' +
                '?near=4,52&srid=4326&page_size=1&mission_year=2017' +
                '&mission_type=ABC&radius=250&newest_in_range=true&limit_results=1',
                undefined,
                jasmine.anything()
            );
        });

        it('doesnt call without geolocation', () => {
            straatbeeldApi.getImageDataByLocation(null);
            expect(api.getByUrl).not.toHaveBeenCalled();

            straatbeeldApi.getImageDataByLocation('1');
            expect(api.getByUrl).not.toHaveBeenCalled();
        });
    });

    describe('the API will handle the found data for geolocation', () => {
        beforeEach(() => {
            spyOn(api, 'getByUrl').and.callThrough();
        });

        it('returns data when a near location is found', () => {
            let response;

            straatbeeldApi.getImageDataByLocation([52, 4]).then(function (_response_) {
                response = _response_;
            });

            $rootScope.$apply();

            expect(response).toEqual({
                id: 'TMX7315120208-000054_pano_0002_000177',
                location: [52.3747994036985, 4.91359770418102],
                date: new Date('2016-05-19T13:04:15.341110Z'),
                hotspots: [{
                    id: 'TMX7315120208-000054_pano_0002_000178',
                    heading: 127.37,
                    distance: 5.25,
                    year: 2017
                }],
                image: {
                    baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
                    pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                    preview: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
                }
            });
        });

        it('expands the search radius when no near location is found', () => {
            straatbeeldApi.getImageDataByLocation([1, 1]);

            $rootScope.$apply();

            // First call without results
            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/panorama/panoramas/' +
                '?near=1,1&srid=4326&page_size=1&radius=250&newest_in_range=true&limit_results=1',
                undefined,
                jasmine.anything()
            );

            // Second call with larger radius
            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/panorama/panoramas/' +
                '?near=1,1&srid=4326&page_size=1&radius=100000&limit_results=1',
                undefined,
                jasmine.anything()
            );
        });
    });

    describe('the API will be mapped to the state structure', () => {
        let response;

        beforeEach(() => {
            spyOn(geojson, 'getCenter').and.callThrough();

            straatbeeldApi.getImageDataById('ABC').then(function (_response_) {
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
                baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
                pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
                preview: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
            });
        });
    });

    describe('the history selection', () => {
        beforeEach(() => {
            spyOn(api, 'getByUrl').and.callThrough();
        });

        it('will make \'getImageDataById\' use another endpoint', () => {
            straatbeeldApi.getImageDataById('ABC', 2020);

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/panorama/panoramas/ABC/adjacencies/?newest_in_range=true',
                undefined,
                jasmine.anything()
            );
        });

        it('will not change the endpoint when falsy', () => {
            straatbeeldApi.getImageDataByLocation([52, 4], 0);

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/panorama/panoramas/' +
                '?near=4,52&srid=4326&page_size=1&radius=250&newest_in_range=true&limit_results=1',
                undefined,
                jasmine.anything()
            );

            api.getByUrl.calls.reset();

            straatbeeldApi.getImageDataById('ABC', 0);

            expect(api.getByUrl).toHaveBeenCalledWith(
                'http://pano.amsterdam.nl/panorama/panoramas/ABC/adjacencies/?newest_in_range=true',
                undefined,
                jasmine.anything()
            );
        });
    });
});
