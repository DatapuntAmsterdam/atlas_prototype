describe('The layers factory', function () {
    var L,
        layers,
        mockedLeafletMap,
        hasLayer;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                mapConfig: {
                    BASE_LAYER_OPTIONS: {
                        option_a: false,
                        option_b: 4
                    },
                    OVERLAY_OPTIONS: {
                        numberOfThings: 4,
                        shouldThisWork: true
                    },
                    OVERLAY_ROOT: 'http://www.example.com/overlay-root/'
                }
            },
            function ($provide) {
                $provide.constant('BASE_LAYERS', [
                    {
                        slug: 'baselayer_a',
                        label: 'Base layer A',
                        urlTemplate: 'https://example.com/mocked-base-layer-a.png'
                    }, {
                        slug: 'baselayer_b',
                        label: 'Base layer B',
                        urlTemplate: 'https://example.com/mocked-base-layer-b.png'
                    }
                ]);

                $provide.constant('OVERLAYS', {
                    SOURCES: {
                        overlay_a: {
                            url: 'overlay_a_url',
                            layers: ['sublayer_1'],
                            external: false
                        },
                        overlay_b: {
                            url: 'overlay_b_url',
                            layers: ['sublayer_1', 'sublayer_2'],
                            external: false
                        },
                        overlay_c: {
                            url: 'http://www.external-url.com/overlay_c_url',
                            layers: ['sublayer_1'],
                            external: true
                        }
                    }
                });
            }
        );

        angular.mock.inject(function (_L_, _layers_) {
            L = _L_;
            layers = _layers_;
        });

        mockedLeafletMap = {
            _leaflet_id: 1,
            hasLayer: function () {
                return hasLayer;
            },
            addLayer: function () {},
            removeLayer: function () {}
        };

        spyOn(mockedLeafletMap, 'hasLayer').and.callThrough();
        spyOn(mockedLeafletMap, 'addLayer');
        spyOn(mockedLeafletMap, 'removeLayer');
    });

    describe('baseLayer', function () {
        beforeEach(function () {
            hasLayer = false;

            spyOn(L, 'tileLayer').and.returnValue('FAKE_BASE_LAYER');
        });

        it('can set a baseLayer', function () {
            layers.setBaseLayer(mockedLeafletMap, 'baselayer_a');

            expect(L.tileLayer).toHaveBeenCalledWith(
                'https://example.com/mocked-base-layer-a.png',
                {
                    option_a: false,
                    option_b: 4
                }
            );

            expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith('FAKE_BASE_LAYER');
        });

        it('makes sure a maximum of one baseLayer is active at the same time', function () {
            layers.setBaseLayer(mockedLeafletMap, 'baselayer_a');
            expect(mockedLeafletMap.hasLayer).toHaveBeenCalledWith(undefined);

            hasLayer = true;

            layers.setBaseLayer(mockedLeafletMap, 'baselayer_b');
            expect(mockedLeafletMap.hasLayer).toHaveBeenCalledWith('FAKE_BASE_LAYER');
            expect(mockedLeafletMap.removeLayer).toHaveBeenCalledWith('FAKE_BASE_LAYER');

            expect(L.tileLayer).toHaveBeenCalledWith(
                'https://example.com/mocked-base-layer-b.png',
                {
                    option_a: false,
                    option_b: 4
                }
            );

            expect(mockedLeafletMap.addLayer).toHaveBeenCalledTimes(2);
            expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith('FAKE_BASE_LAYER');
        });
    });

    describe('overlays', function () {
        var fakeWmsSource;

        beforeEach(function () {
            fakeWmsSource = {
                getLayer: function (layerName) {
                    return 'FAKE_' + layerName.toUpperCase();
                }
            };

            spyOn(L.WMS, 'source').and.returnValue(fakeWmsSource);
        });

        it('can add an overlay', function () {
            layers.addOverlay(mockedLeafletMap, 'overlay_a');

            expect(L.WMS.source).toHaveBeenCalledWith(
                'http://www.example.com/overlay-root/overlay_a_url', {
                    numberOfThings: 4,
                    shouldThisWork: true
                }
            );

            expect(mockedLeafletMap.addLayer).toHaveBeenCalledTimes(1);
            expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith('FAKE_SUBLAYER_1');
        });

        it('can add multiples sublayers per overlay', function () {
            layers.addOverlay(mockedLeafletMap, 'overlay_b');

            expect(L.WMS.source).toHaveBeenCalledWith(
                'http://www.example.com/overlay-root/overlay_b_url', {
                    numberOfThings: 4,
                    shouldThisWork: true
                }
            );

            expect(mockedLeafletMap.addLayer).toHaveBeenCalledTimes(2);
            expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith('FAKE_SUBLAYER_1');
            expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith('FAKE_SUBLAYER_2');
        });

        it('can add on overlay from an external source', function () {
            layers.addOverlay(mockedLeafletMap, 'overlay_c');

            expect(L.WMS.source).toHaveBeenCalledWith(
                'http://www.external-url.com/overlay_c_url', {
                    numberOfThings: 4,
                    shouldThisWork: true
                }
            );

            expect(mockedLeafletMap.addLayer).toHaveBeenCalledTimes(1);
            expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith('FAKE_SUBLAYER_1');
        });

        it('can remove an overlay with one sublayer', function () {
            layers.removeOverlay(mockedLeafletMap, 'overlay_a');

            expect(mockedLeafletMap.removeLayer).toHaveBeenCalledTimes(1);
            expect(mockedLeafletMap.removeLayer).toHaveBeenCalledWith('FAKE_SUBLAYER_1');
        });

        it('can remove an overlay with multiple sublayers', function () {
            layers.removeOverlay(mockedLeafletMap, 'overlay_b');

            expect(mockedLeafletMap.removeLayer).toHaveBeenCalledTimes(2);
            expect(mockedLeafletMap.removeLayer).toHaveBeenCalledWith('FAKE_SUBLAYER_1');
            expect(mockedLeafletMap.removeLayer).toHaveBeenCalledWith('FAKE_SUBLAYER_2');
        });

        it('caches the result of L.WMS.source per L.map instance', function () {
            expect(L.WMS.source).not.toHaveBeenCalled();

            layers.addOverlay(mockedLeafletMap, 'overlay_a');
            expect(L.WMS.source).toHaveBeenCalledTimes(1);

            layers.removeOverlay(mockedLeafletMap, 'overlay_a');
            layers.addOverlay(mockedLeafletMap, 'overlay_a');
            expect(L.WMS.source).toHaveBeenCalledTimes(1);

            // Change the L.map instance
            mockedLeafletMap._leaflet_id = 2;

            // Add the same layer again, expect a new call
            layers.addOverlay(mockedLeafletMap, 'overlay_a');
            expect(L.WMS.source).toHaveBeenCalledTimes(2);

            layers.removeOverlay(mockedLeafletMap, 'overlay_a');
            layers.addOverlay(mockedLeafletMap, 'overlay_a');
            expect(L.WMS.source).toHaveBeenCalledTimes(2);
        });
    });
});
