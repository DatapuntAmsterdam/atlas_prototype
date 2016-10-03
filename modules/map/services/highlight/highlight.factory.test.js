describe('The highlight factory', function () {
    var highlight,
        L,
        crsService,
        crsConverter,
        geojson,
        store,
        ACTIONS,
        mockedLeafletMap,
        mockedItems = {
            item_multipolygon: {
                id: 'item_multipolygon',
                geometry: {
                    type: 'MultiPolygon',
                    coordinates: [
                        [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                        [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                    ]
                },
                useAutoFocus: true
            },
            item_polygon: {
                id: 'item_polygon',
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [100.0, 0.0], [102.0, 0.0], [102.0, 10.0], [100.0, 10.0], [100.0, 0.0]
                        ]
                    ]
                },
                useAutoFocus: true
            },
            item_point: {
                id: 'item_point',
                geometry: {
                    type: 'Point',
                    coordinates: [100.0, 0.0]
                },
                useAutoFocus: true
            },
            item_marker: {
                id: 'item_marker',
                geometry: {
                    type: 'Point',
                    coordinates: [100.0, 0.0]
                },
                useAutoFocus: false
            },
            item_rotated_marker: {
                id: 'item_rotated_marker',
                geometry: {
                    type: 'Point',
                    coordinates: [100.0, 0.0]
                },
                useAutoFocus: false,
                orientation: 179
            }
        },
        mockedLayer = {
            getBounds: function () {
                return 'FAKE_LAYER_BOUNDS';
            }
        },
        projGeoJsonArguments;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                angleConversion: {
                    radiansToDegrees: function () {
                        return 180;
                    }
                },
                mapConfig: {
                    DEFAULT_ZOOM_HIGHLIGHT: 14
                },
                crsConverter: {
                    rdToWgs84: function (location) {
                        if (location === 'FAKE_POINT_CENTER_RD') {
                            return 'FAKE_POINT_CENTER_WGS84';
                        } else if (location === 'FAKE_POLYGON_CENTER_RD') {
                            return 'FAKE_POLYGON_CENTER_WGS84';
                        } else if (location === 'FAKE_MULTIPOLYGON_CENTER_RD') {
                            return 'FAKE_MULTIPOLYGON_CENTER_WGS84';
                        }
                    }
                },
                geojson: {
                    getCenter: function (geometry) {
                        if (geometry.type === 'Point') {
                            return 'FAKE_POINT_CENTER_RD';
                        } else if (geometry.type === 'Polygon') {
                            return 'FAKE_POLYGON_CENTER_RD';
                        } else if (geometry.type === 'MultiPolygon') {
                            return 'FAKE_MULTIPOLYGON_CENTER_RD';
                        }

                    }
                },
                panning: {
                    getCurrentLocation: function () {
                        return 'FAKE_LOCATION_CENTER';
                    }
                },
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.constant('ICON_CONFIG', {
                    item_multipolygon: {
                        foo: 'a'
                    },
                    item_polygon: {
                        foo: 'b'
                    },
                    item_point: {
                        foo: 'b'
                    },
                    item_marker: {
                        foo: 'c'
                    },
                    item_rotated_marker: {
                        foo: 'd'
                    }
                });
            }
        );

        angular.mock.inject(function (_highlight_, _L_, _crsService_, _crsConverter_, _geojson_, _store_, _ACTIONS_) {
            highlight = _highlight_;
            L = _L_;
            crsService = _crsService_;
            crsConverter = _crsConverter_;
            geojson = _geojson_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        }); 

        mockedLeafletMap = {
            addLayer: function () {},
            removeLayer: function () {},
            fitBounds: function () {},
            getBoundsZoom: function () {},
            getCenter: function () {
                return {
                    lat: 'FAKE_LATITUDE',
                    lng: 'FAKE_LONGITUDE'
                };
            },
            getZoom: function () {}
        };

        spyOn(mockedLeafletMap, 'addLayer');
        spyOn(mockedLeafletMap, 'removeLayer');
        spyOn(mockedLeafletMap, 'fitBounds').and.callThrough();

        L.Proj.geoJson = function () {
            projGeoJsonArguments = arguments;

            return mockedLayer;
        };

        spyOn(L.Proj, 'geoJson').and.callThrough();
        spyOn(L, 'icon').and.returnValue('FAKE_ICON');
        spyOn(L, 'marker');

        spyOn(crsService, 'getRdObject').and.returnValue('FAKE_RD_OBJECT');

        spyOn(crsConverter, 'rdToWgs84').and.callThrough();
        spyOn(geojson, 'getCenter').and.callThrough();

        spyOn(store, 'dispatch');
    });

    afterEach(function () {
        projGeoJsonArguments = undefined;
    });

    it('has an initialize function to set the Leaflet image path for icons to \'assets\'', function () {
        expect(L.Icon.Default.imagePath).not.toBe('assets');

        highlight.initialize();
        expect(L.Icon.Default.imagePath).toBe('assets');
    });

    it('can add a MultiPolygons to the map', function () {
        var item = {
            id: 'item_multipolygon',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                    [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                    [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                ]
            }
        };

        highlight.add(mockedLeafletMap, item);

        expect(L.Proj.geoJson).toHaveBeenCalledWith(jasmine.objectContaining(item.geometry), jasmine.any(Object));
        expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith(mockedLayer);
    });

    it('has custom styling for MultiPolygons', function () {
        highlight.add(mockedLeafletMap, mockedItems.item_multipolygon);

        //In the real world Leaflet calls the style function
        expect(projGeoJsonArguments[1].style()).toEqual({
            color: 'red',
            fillColor: 'red',
            weight: 2,
            opacity: 1.6,
            fillOpacity: 0.2
        });
    });

    it('can add markers with custom icons to the map', function () {
        var item = {
            id: 'item_marker',
            geometry: {
                type: 'Point',
                coordinates: [100.0, 0.0]
            }
        };

        highlight.add(mockedLeafletMap, mockedItems.item_marker);

        expect(L.Proj.geoJson).toHaveBeenCalledWith(jasmine.objectContaining(item.geometry), jasmine.any(Object));
        projGeoJsonArguments[1].pointToLayer(null, 'FAKE_LATLNG'); //In the real world Leaflet calls this function

        expect(L.icon).toHaveBeenCalledWith({
            foo: 'c'
        });

        expect(L.marker).toHaveBeenCalledWith('FAKE_LATLNG', jasmine.objectContaining({
            icon: 'FAKE_ICON'
        }));

        expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith(mockedLayer);
    });

    it('can add rotated markers to the map', function () {
        highlight.add(mockedLeafletMap, mockedItems.item_rotated_marker);
        projGeoJsonArguments[1].pointToLayer(null, 'FAKE_LATLNG'); //In the real world Leaflet calls this function

        expect(L.marker).toHaveBeenCalledWith('FAKE_LATLNG', {
            icon: 'FAKE_ICON',
            rotationAngle: 179
        });
    });

    it('sets the CRS to RD', function () {
        ['item_multipolygon', 'item_marker', 'item_rotated_marker'].forEach(function (item) {
            highlight.add(mockedLeafletMap, mockedItems[item]);

            expect(L.Proj.geoJson).toHaveBeenCalledWith(
                angular.merge(
                    mockedItems[item].geometry,
                    {
                        crs: 'FAKE_RD_OBJECT'
                    }
                ),
                jasmine.any(Object)
            );
        });
    });

    it('can remove highlighted things from the map', function () {
        ['item_multipolygon', 'item_marker', 'item_rotated_marker'].forEach(function (item) {
            highlight.add(mockedLeafletMap, mockedItems[item]);
            highlight.remove(mockedLeafletMap, mockedItems[item]);

            expect(mockedLeafletMap.removeLayer).toHaveBeenCalledWith(mockedLayer);
        });
    });

    describe('triggers MAP_ZOOM when geometry has been found (center and zoom)', function () {
        it('Points do center automatically but use a default zoom level', function () {
            spyOn(mockedLeafletMap, 'getBoundsZoom').and.returnValue(NaN);
            spyOn(mockedLeafletMap, 'getZoom').and.returnValue(13);

            highlight.add(mockedLeafletMap, mockedItems.item_point);
            expect(mockedLeafletMap.fitBounds).not.toHaveBeenCalled();

            //14 is the fallback zoom level defined in mapConfig.DEFAULT_ZOOM_HIGHLIGHT
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ZOOM,
                payload: {
                    viewCenter: 'FAKE_POINT_CENTER_WGS84',
                    zoom: 14
                }
            });
        });

        it('Points will not zoom out when viewing with a zoom level larger than 14', function () {
            spyOn(mockedLeafletMap, 'getBoundsZoom').and.returnValue(NaN);
            spyOn(mockedLeafletMap, 'getZoom').and.returnValue(15);

            highlight.add(mockedLeafletMap, mockedItems.item_point);
            expect(mockedLeafletMap.fitBounds).not.toHaveBeenCalled();

            //14 is the fallback zoom level defined in mapConfig.DEFAULT_ZOOM_HIGHLIGHT
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ZOOM,
                payload: {
                    viewCenter: 'FAKE_POINT_CENTER_WGS84',
                    zoom: 15
                }
            });
        });

        it('Polygons support autozoom and auto center (without animation)', function () {
            spyOn(mockedLeafletMap, 'getBoundsZoom').and.returnValue(10);

            highlight.add(mockedLeafletMap, mockedItems.item_polygon);

            expect(mockedLeafletMap.fitBounds).toHaveBeenCalledWith('FAKE_LAYER_BOUNDS', {animate: false});
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ZOOM,
                payload: {
                    viewCenter: 'FAKE_LOCATION_CENTER',
                    zoom: 10
                }
            });
        });

        it('MultiPolygons support autozoom and auto center (without animation)', function () {
            spyOn(mockedLeafletMap, 'getBoundsZoom').and.returnValue(10);

            highlight.add(mockedLeafletMap, mockedItems.item_multipolygon);

            expect(mockedLeafletMap.fitBounds).toHaveBeenCalledWith('FAKE_LAYER_BOUNDS', {animate: false});
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ZOOM,
                payload: {
                    viewCenter: 'FAKE_LOCATION_CENTER',
                    zoom: 10
                }
            });
        });
    });
});