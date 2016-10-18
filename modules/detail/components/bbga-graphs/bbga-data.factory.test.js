describe('The bbgaDataService', function () {
    var $httpBackend,
        bbgaDataService,
        mockedMetaData,
        mockedCijfers;

    beforeEach(function () {
        angular.mock.module(
            'dpDetail',
            function ($provide) {
                $provide.constant('environment', {
                    ENVIRONMENT: 'development',
                    API_ROOT: 'http://www.api-root.com/'
                });

                $provide.constant('BBGA_CONFIG', {
                    MY_GRAPH_SETTINGS: [
                        {
                            variable: 'VARIABELE_A',
                            compareWithAmsterdam: false
                        },
                        {
                            variable: 'VARIABELE_B',
                            compareWithAmsterdam: true
                        }
                    ],
                    MY_GRAPH_SETTINGS_WITH_NO_DATA: [
                        {
                            variable: 'VARIABELE_C',
                            compareWithAmsterdam: false
                        }
                    ]
                });
            }
        );

        angular.mock.inject(function (_$httpBackend_, _bbgaDataService_) {
            $httpBackend = _$httpBackend_;
            bbgaDataService = _bbgaDataService_;
        });

        mockedMetaData = {
            VARIABELE_A: {
                results: [
                    {
                        label: 'Variabele A',
                        peildatum: '1 juli'
                    }
                ]
            },
            VARIABELE_B: {
                results: [
                    {
                        label: 'De tweede variabele',
                        peildatum: '1 januari'
                    }
                ]
            },
            VARIABELE_C: {
                results: [
                    {
                        label: 'Een derde variabele',
                        peildatum: '1 februari'
                    }
                ]
            }
        };

        mockedCijfers = {
            VARIABELE_A: {
                GEBIED_A: {
                    count: 1,
                    results: [
                        {
                            waarde: 100,
                            jaar: 2017
                        }
                    ]
                }
            },
            VARIABELE_B: {
                GEBIED_A: {
                    count: 1,
                    results: [
                        {
                            waarde: 1234.56,
                            jaar: 2012
                        }
                    ]
                },
                STAD: {
                    count: 1,
                    results: [
                        {
                            waarde: 789.123,
                            jaar: 2012
                        }
                    ]
                }
            },
            VARIABELE_C: {
                GEBIED_A: {
                    count: 0,
                    results: []
                }
            }
        };

        $httpBackend
            .whenGET('http://www.api-root.com/bbga/meta/?variabele=VARIABELE_A')
            .respond(mockedMetaData.VARIABELE_A);

        $httpBackend
            .whenGET('http://www.api-root.com/bbga/meta/?variabele=VARIABELE_B')
            .respond(mockedMetaData.VARIABELE_B);

        $httpBackend
            .whenGET('http://www.api-root.com/bbga/meta/?variabele=VARIABELE_C')
            .respond(mockedMetaData.VARIABELE_C);

        $httpBackend
            .whenGET('http://www.api-root.com/bbga/cijfers/?gebiedcode15=GEBIED_A&jaar=latest&variabele=VARIABELE_A')
            .respond(mockedCijfers.VARIABELE_A.GEBIED_A);

        $httpBackend
            .whenGET('http://www.api-root.com/bbga/cijfers/?gebiedcode15=GEBIED_A&jaar=latest&variabele=VARIABELE_B')
            .respond(mockedCijfers.VARIABELE_B.GEBIED_A);

        $httpBackend
            .whenGET('http://www.api-root.com/bbga/cijfers/?gebiedcode15=STAD&jaar=latest&variabele=VARIABELE_B')
            .respond(mockedCijfers.VARIABELE_B.STAD);

        $httpBackend
            .whenGET('http://www.api-root.com/bbga/cijfers/?gebiedcode15=GEBIED_A&jaar=latest&variabele=VARIABELE_C')
            .respond(mockedCijfers.VARIABELE_C.GEBIED_A);
    });

    it('combines and formats metadata and cijfers from the BBGA API', function () {
        bbgaDataService.getGraphData('MY_GRAPH_SETTINGS', 'Gebied A', 'GEBIED_A').then(function (bbgaData) {
            // VARIABELE_A
            expect(bbgaData.VARIABELE_A.meta.label).toBe('Variabele A');
            expect(bbgaData.VARIABELE_A.meta.peildatum).toBe('1 juli');

            expect(bbgaData.VARIABELE_A.data[0].code).toBe('GEBIED_A');
            expect(bbgaData.VARIABELE_A.data[0].waarde).toBe(100);

            // VARIABELE_B
            expect(bbgaData.VARIABELE_B.meta.label).toBe('De tweede variabele');
            expect(bbgaData.VARIABELE_B.meta.peildatum).toBe('1 januari');

            expect(bbgaData.VARIABELE_B.data[0].code).toBe('GEBIED_A');
            expect(bbgaData.VARIABELE_B.data[0].waarde).toBe(1234.56);
        });

        $httpBackend.flush();
    });

    it('adds the gebieds name to the BBGA data', function () {
        bbgaDataService.getGraphData('MY_GRAPH_SETTINGS', 'Gebied A', 'GEBIED_A').then(function (bbgaData) {
            expect(bbgaData.VARIABELE_A.data[0].label).toBe('Gebied A');
            expect(bbgaData.VARIABELE_B.data[0].label).toBe('Gebied A');
        });

        bbgaDataService
            .getGraphData('MY_GRAPH_SETTINGS', 'Dit is een andere titel voor gebied A', 'GEBIED_A')
            .then(function (bbgaData) {
                expect(bbgaData.VARIABELE_A.data[0].label).toBe('Dit is een andere titel voor gebied A');
                expect(bbgaData.VARIABELE_B.data[0].label).toBe('Dit is een andere titel voor gebied A');
            });

        $httpBackend.flush();
    });

    it('returns null for data that isn\'t available in the BBGA API', function () {
        bbgaDataService.getGraphData('MY_GRAPH_SETTINGS_WITH_NO_DATA', 'Gebied A', 'GEBIED_A')
            .then(function (bbgaData) {
                expect(bbgaData.VARIABELE_C.meta.jaar).toBeNull();
                expect(bbgaData.VARIABELE_C.data[0].waarde).toBeNull();

            // The other variables are set as usual
                expect(bbgaData.VARIABELE_C.meta.label).toBe('Een derde variabele');
                expect(bbgaData.VARIABELE_C.meta.peildatum).toBe('1 februari');

                expect(bbgaData.VARIABELE_C.data[0].label).toBe('Gebied A');
                expect(bbgaData.VARIABELE_C.data[0].code).toBe('GEBIED_A');
            });

        $httpBackend.flush();
    });

    it('optionally adds data for amsterdam (gebiedscode STAD) based on the BBGA_CONFIG', function () {
        bbgaDataService.getGraphData('MY_GRAPH_SETTINGS', 'Gebied A', 'GEBIED_A').then(function (bbgaData) {
            // When compareWithAmsterdam is false
            expect(bbgaData.VARIABELE_A.data.length).toBe(1);

            // When compareWithAmsterdam is true
            expect(bbgaData.VARIABELE_B.data.length).toBe(2);
            expect(bbgaData.VARIABELE_B.data[1].code).toBe('STAD');
            expect(bbgaData.VARIABELE_B.data[1].waarde).toBe(789.123);
            expect(bbgaData.VARIABELE_B.data[1].label).toBe('Amsterdam');
        });

        $httpBackend.flush();
    });

    it('makes the jaar variable part of the metadata', function () {
        bbgaDataService.getGraphData('MY_GRAPH_SETTINGS', 'Gebied A', 'GEBIED_A').then(function (bbgaData) {
            expect(bbgaData.VARIABELE_A.meta.jaar).toBe(2017);
            expect(bbgaData.VARIABELE_A.data[0].jaar).toBeUndefined();

            expect(bbgaData.VARIABELE_B.meta.jaar).toBe(2012);
            expect(bbgaData.VARIABELE_B.data[0].jaar).toBeUndefined();
            expect(bbgaData.VARIABELE_B.data[1].jaar).toBeUndefined();
        });

        $httpBackend.flush();
    });
});
