describe('The layers factory', () => {
    let $rootScope,
        $q,
        api,
        L,
        layers,
        mockedLeafletMap;

    beforeEach(() => {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    getState: () => ({ user: { } })
                },
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
                },
                overlays: {
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
            }
        );

        angular.mock.inject(function (_$rootScope_, _$q_, _api_, _L_, _layers_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            api = _api_;
            L = _L_;
            layers = _layers_;
        });

        mockedLeafletMap = {
            _leaflet_id: 1,
            hasLayer: angular.noop,
            addLayer: angular.noop,
            removeLayer: angular.noop
        };

        spyOn(mockedLeafletMap, 'hasLayer');
        spyOn(mockedLeafletMap, 'addLayer');
        spyOn(mockedLeafletMap, 'removeLayer');
    });

    describe('baseLayer', () => {
        beforeEach(() => {
            spyOn(L, 'tileLayer').and.returnValue('FAKE_BASE_LAYER');
        });

        it('can set a baseLayer', () => {
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

        it('makes sure a maximum of one baseLayer is active at the same time', () => {
            layers.setBaseLayer(mockedLeafletMap, 'baselayer_a');
            expect(mockedLeafletMap.hasLayer).toHaveBeenCalledWith(undefined);

            mockedLeafletMap.hasLayer.and.returnValue(true);

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

    describe('overlays', () => {
        let fakeWmsSource,
            setOpacity,
            addTo,
            removeFrom;

        beforeEach(() => {
            setOpacity = jasmine.createSpy();
            addTo = jasmine.createSpy();
            removeFrom = jasmine.createSpy();

            L.nonTiledLayer = {
                wms: angular.noop
            };

            fakeWmsSource = function (wmsUrl, options) {
                return {
                    _name: 'FAKE_LAYERS_' + options.layers.concat('-'),
                    setOpacity,
                    addTo,
                    removeFrom
                };
            };
            spyOn(L.nonTiledLayer, 'wms').and.callFake(fakeWmsSource);
        });

        describe('adding overlays', () => {
            it('can add an overlay', () => {
                layers.addOverlay(mockedLeafletMap, 'overlay_a');
                $rootScope.$digest();

                expect(L.nonTiledLayer.wms).toHaveBeenCalledWith(
                    'http://www.example.com/overlay-root/overlay_a_url', {
                        numberOfThings: 4,
                        shouldThisWork: true,
                        layers: ['sublayer_1']
                    }
                );

                expect(addTo).toHaveBeenCalledWith(mockedLeafletMap);
            });

            it('adds only overlays that exist', () => {
                layers.addOverlay(mockedLeafletMap, 'overlay_does_not_exist');
                $rootScope.$digest();

                expect(L.nonTiledLayer.wms).not.toHaveBeenCalled();

                expect(addTo).not.toHaveBeenCalled();
            });

            it('can add multiples sublayers per overlay', () => {
                layers.addOverlay(mockedLeafletMap, 'overlay_b');
                $rootScope.$digest();

                expect(L.nonTiledLayer.wms).toHaveBeenCalledWith(
                    'http://www.example.com/overlay-root/overlay_b_url', {
                        numberOfThings: 4,
                        shouldThisWork: true,
                        layers: ['sublayer_1', 'sublayer_2']
                    }
                );

                expect(addTo).toHaveBeenCalledWith(mockedLeafletMap);
            });

            it('adds the access token to internal overlay sources', () => {
                const tokenized = $q.resolve('http://www.example.com/overlay-root/overlay_b_url?token=abc');
                spyOn(api, 'createUrlWithToken').and.returnValue(tokenized);

                layers.addOverlay(mockedLeafletMap, 'overlay_b');
                $rootScope.$digest();

                expect(L.nonTiledLayer.wms).toHaveBeenCalledWith(
                    'http://www.example.com/overlay-root/overlay_b_url?token=abc', {
                        numberOfThings: 4,
                        shouldThisWork: true,
                        layers: ['sublayer_1', 'sublayer_2']
                    }
                );
            });

            it('can add on overlay from an external source', () => {
                layers.addOverlay(mockedLeafletMap, 'overlay_c');
                $rootScope.$digest();

                expect(L.nonTiledLayer.wms).toHaveBeenCalledWith(
                    'http://www.external-url.com/overlay_c_url', {
                        numberOfThings: 4,
                        shouldThisWork: true,
                        layers: ['sublayer_1']
                    }
                );

                expect(addTo).toHaveBeenCalledWith(mockedLeafletMap);
            });
        });

        describe('removing overlays', () => {
            it('can remove an overlay with one sublayer', () => {
                layers.removeOverlay(mockedLeafletMap, 'overlay_a');
                $rootScope.$digest();

                expect(L.nonTiledLayer.wms).toHaveBeenCalledWith(
                    'http://www.example.com/overlay-root/overlay_a_url', {
                        numberOfThings: 4,
                        shouldThisWork: true,
                        layers: ['sublayer_1']
                    }
                );

                expect(removeFrom).toHaveBeenCalledWith(mockedLeafletMap);
            });

            it('can remove an overlay with multiple sublayers', () => {
                layers.removeOverlay(mockedLeafletMap, 'overlay_b');
                $rootScope.$digest();

                expect(L.nonTiledLayer.wms).toHaveBeenCalledWith(
                    'http://www.example.com/overlay-root/overlay_b_url', {
                        numberOfThings: 4,
                        shouldThisWork: true,
                        layers: ['sublayer_1', 'sublayer_2']
                    }
                );

                expect(removeFrom).toHaveBeenCalledWith(mockedLeafletMap);
            });

            it('caches the result of L.WMS.source per L.map instance', () => {
                expect(L.nonTiledLayer.wms).not.toHaveBeenCalled();

                layers.addOverlay(mockedLeafletMap, 'overlay_a');
                $rootScope.$digest();
                expect(L.nonTiledLayer.wms).toHaveBeenCalledTimes(1);

                layers.removeOverlay(mockedLeafletMap, 'overlay_a');
                layers.addOverlay(mockedLeafletMap, 'overlay_a');
                $rootScope.$digest();
                expect(L.nonTiledLayer.wms).toHaveBeenCalledTimes(1);

                // Change the L.map instance
                mockedLeafletMap._leaflet_id = 2;

                // Add the same layer again, expect a new call
                layers.addOverlay(mockedLeafletMap, 'overlay_a');
                $rootScope.$digest();
                expect(L.nonTiledLayer.wms).toHaveBeenCalledTimes(2);

                layers.removeOverlay(mockedLeafletMap, 'overlay_a');
                layers.addOverlay(mockedLeafletMap, 'overlay_a');
                $rootScope.$digest();
                expect(L.nonTiledLayer.wms).toHaveBeenCalledTimes(2);
            });
        });

        describe('showing overlays', () => {
            it('can show an overlay with one sublayer', () => {
                layers.showOverlay(mockedLeafletMap, 'overlay_a');
                $rootScope.$digest();

                expect(setOpacity).toHaveBeenCalledTimes(1);
                expect(setOpacity).toHaveBeenCalledWith(1);
            });

            it('can hide an overlay with two sublayers', () => {
                layers.hideOverlay(mockedLeafletMap, 'overlay_b');
                $rootScope.$digest();

                expect(setOpacity).toHaveBeenCalledTimes(1);
                expect(setOpacity).toHaveBeenCalledWith(0);
            });
        });
    });
});
