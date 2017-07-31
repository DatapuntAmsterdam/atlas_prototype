describe('The geometry factory', () => {
    var $q,
        $rootScope,
        geometry,
        mockedData = [
            {
                // G Perceel
                url: 'http://www.api-root.nl/brk/object/NL.KAD.OnroerendeZaak.123456/',
                response: {
                    geometrie: {
                        FAKE_GEOJSON: 'G_PERCEEL'
                    }
                }
            }, {
                // A Perceel
                url: 'http://www.api-root.nl/brk/object/NL.KAD.OnroerendeZaak.456789/',
                response: {
                    index_letter: 'A',
                    g_percelen: {
                        href: 'http://mocked-atlas-api.amsterdam.nl/brk/object/?a_percelen__id=NL.KAD.OnroerendeZaak.' +
                            '123456'
                    }
                }
            }, {
                // G Percelen (meervoud)
                url: 'http://mocked-atlas-api.amsterdam.nl/brk/object/?a_percelen__id=NL.KAD.OnroerendeZaak.123456',
                response: {
                    results: [{
                        _links: {
                            self: {
                                href: 'http://www.api-root.nl/brk/object/NL.KAD.OnroerendeZaak.123456/'
                            }
                        }
                    }]
                }
            }, {
                // Nummeraanduiding - verblijfsobject
                url: 'http://www.api-root.nl/bag/nummeraanduiding/10000001/',
                response: {
                    type: 'Verblijfsobject',
                    verblijfsobject: 'http://mocked-atlas-api.amsterdam.nl/bag/verblijfsobject/20000001/'
                }
            }, {
                // Verblijfsobject
                url: 'http://mocked-atlas-api.amsterdam.nl/bag/verblijfsobject/20000001/',
                response: {
                    geometrie: {
                        FAKE_GEOJSON: 'VERBLIJFSOBJECT'
                    }
                }
            }, {
                // Nummeraanduiding - ligplaats
                url: 'http://www.api-root.nl/bag/nummeraanduiding/10000002/',
                response: {
                    type: 'Ligplaats',
                    ligplaats: 'http://mocked-atlas-api.amsterdam.nl/bag/ligplaats/20000002/'
                }
            }, {
                // Ligplaats
                url: 'http://mocked-atlas-api.amsterdam.nl/bag/ligplaats/20000002/',
                response: {
                    geometrie: {
                        FAKE_GEOJSON: 'LIGPLAATS'
                    }
                }
            }, {
                // Nummeraanduiding - standplaats
                url: 'http://www.api-root.nl/bag/nummeraanduiding/10000003/',
                response: {
                    type: 'Standplaats',
                    standplaats: 'http://mocked-atlas-api.amsterdam.nl/bag/standplaats/20000001/'
                }
            }, {
                // Standplaats
                url: 'http://mocked-atlas-api.amsterdam.nl/bag/standplaats/20000001/',
                response: {
                    geometrie: {
                        FAKE_GEOJSON: 'STANDPLAATS'
                    }
                }
            }, {
                // Kadastraal subject
                url: 'http://www.api-root.nl/brk/subject/NL.KAD.Persoon.123456/',
                response: {}
            }, {
                // Kadastraal subject
                url: 'http://www.api-root.nl/brk/subject/NL.KAD.Persoon.123456/',
                response: {}
            }, {
                // vestiging in Amsterdam
                url: 'https://www.api-root.nl/handelsregister/vestiging/123/',
                response: {
                    bezoekadres: {
                        geometrie: {
                            coordinates: [119695.616, 483365.537]
                        }
                    }
                }
            }, {
                // Monument
                url: 'http://www.api-root.nl/monumenten/monumenten/987654321/',
                response: {
                    monumentcoordinaten: {
                        coordinates: [119695.616, 483365.537]
                    }
                }
            }, {
                // vestiging Rotterdam (zowel x als y buiten range)
                url: 'https://www.api-root.nl/handelsregister/vestiging/456/',
                response: {
                    bezoekadres: {
                        geometrie: {
                            coordinates: [91860.717, 437504.737]
                        }
                    }
                }
            }, {
                // vestiging hoofddorp (een van de waardes x/y buiten range)
                url: 'https://www.api-root.nl/handelsregister/vestiging/789/',
                response: {
                    bezoekadres: {
                        geometrie: {
                            coordinates: [108173.02, 478466.281]
                        }
                    }
                }
            }
        ];

    beforeEach(() => {
        angular.mock.module(
            'dpDetail',
            {
                api: {
                    getByUrl: function (url) {
                        var q = $q.defer(),
                            response;

                        response = mockedData.filter(item => item.url === url)[0].response;

                        q.resolve(response);

                        return q.promise;
                    }
                }
            }
        );

        angular.mock.inject((_$q_, _$rootScope_, _geometry_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;
            geometry = _geometry_;
        });
    });

    it('returns the GeoJSON of an URL', () => {
        var response;

        geometry.getGeoJSON('http://www.api-root.nl/brk/object/NL.KAD.OnroerendeZaak.123456/').then(data => {
            response = data;
        });

        $rootScope.$apply();

        expect(response).toEqual({
            FAKE_GEOJSON: 'G_PERCEEL'
        });
    });

    it('returns the GeoJSON of the monument', () => {
        var response;

        geometry
            .getGeoJSON('http://www.api-root.nl/monumenten/monumenten/987654321/')
            .then(data => {
                response = data;
            });

        $rootScope.$apply();

        expect(response).toEqual({
            coordinates: [119695.616, 483365.537]
        });
    });

    describe('when searching for the geometry of a vestiging', () => {
        it('returns the GeoJSON of the bezoekadres if it falls within the bounding box of the map', () => {
            var response;

            geometry
                .getGeoJSON('https://www.api-root.nl/handelsregister/vestiging/123/')
                .then(data => {
                    response = data;
                });

            $rootScope.$apply();

            expect(response).toEqual({
                coordinates: [119695.616, 483365.537]
            });
        });
        it('returns the Null if it does not fall within the bounding box of the map', () => {
            var response;

            // BOTH x and y
            geometry
                .getGeoJSON('https://www.api-root.nl/handelsregister/vestiging/456/')
                .then(data => {
                    response = data;
                });

            $rootScope.$apply();

            expect(response).toBeNull();

            // Either x or y
            geometry
                .getGeoJSON('https://www.api-root.nl/handelsregister/vestiging/789/')
                .then(data => {
                    response = data;
                });

            $rootScope.$apply();

            expect(response).toBeNull();
        });
    });

    describe('when searching for the geometry of an A perceel', () => {
        it('returns the GeoJSON of the parent G perceel', () => {
            var response;

            geometry
                .getGeoJSON('http://www.api-root.nl/brk/object/NL.KAD.OnroerendeZaak.456789/')
                .then(data => {
                    response = data;
                });

            $rootScope.$apply();

            expect(response).toEqual({
                FAKE_GEOJSON: 'G_PERCEEL'
            });
        });
    });

    describe('when searching for the geometry of a nummeraanduiding', () => {
        describe('returns the GeoJSON of the parent adressseerbaar object', () => {
            it('should return the verblijfsobject geometry when the type of nummeraanduiding is verblijfsobject',
                () => {
                    var response;

                    geometry.getGeoJSON('http://www.api-root.nl/bag/nummeraanduiding/10000001/').then(data => {
                        response = data;
                    });

                    $rootScope.$apply();

                    expect(response).toEqual({
                        FAKE_GEOJSON: 'VERBLIJFSOBJECT'
                    });
                }
            );

            it('should return the ligplaats geometry when the type of nummeraanduiding is Ligplaats', () => {
                var response;

                geometry.getGeoJSON('http://www.api-root.nl/bag/nummeraanduiding/10000002/').then(data => {
                    response = data;
                });

                $rootScope.$apply();

                expect(response).toEqual({
                    FAKE_GEOJSON: 'LIGPLAATS'
                });
            });

            it('should return the standplaats geometry when the type of nummeraanduiding is Standplaats', () => {
                var response;

                geometry.getGeoJSON('http://www.api-root.nl/bag/nummeraanduiding/10000003/').then(data => {
                    response = data;
                });

                $rootScope.$apply();

                expect(response).toEqual({
                    FAKE_GEOJSON: 'STANDPLAATS'
                });
            });
        });
    });

    it('will return null if there is no geometry available', () => {
        var response;

        geometry.getGeoJSON('http://www.api-root.nl/brk/subject/NL.KAD.Persoon.123456/').then(data => {
            response = data;
        });

        $rootScope.$apply();

        expect(response).toBeNull();
    });
});
