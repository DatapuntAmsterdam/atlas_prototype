describe('The marzipanoService factory', function () {
    var $rootScope,
        $q,
        Marzipano,
        marzipanoService,
        panoramaApi,
        hotspotService,
        fakeView,
        fakeCubeGeometery,
        fakeViewer,
        fakeHotspotContainer,
        fakeScene;

    beforeEach(function () {
        angular.mock.module(
            'dpPanorama',
            {
                panoramaConfig: {
                    MAX_RESOLUTION: 1000,
                    MAX_FOV: 100,
                    CAMERA_HEIGHT: 1
                },
                angleConversion: {
                    degreesToRadians: function (input) {
                        return input /2;
                    }
                },
                panoramaApi: {
                    getImageSourceUrl: function (sceneId) {
                        return 'http://www.image-source-url.com/' + sceneId;
                    }
                },
                hotspotService: {
                    createHotspotTemplate: function () {
                        var q = $q.defer();

                        q.resolve('FAKE_HOTSPOT_TEMPLATE');

                        return q.promise;
                    }
                }
            }
        );

        angular.mock.inject(
            function (_$rootScope_, _$q_, _Marzipano_, _marzipanoService_, _panoramaApi_, _hotspotService_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                Marzipano = _Marzipano_;
                marzipanoService = _marzipanoService_;
                panoramaApi = _panoramaApi_;
                hotspotService = _hotspotService_;
            }
        );

        fakeView = {
            setYaw: function () {},
            setPitch: function () {},
            setFov: function () {}
        };

        fakeCubeGeometery = {
            whatever: 'some data'
        };

        fakeViewer = {
            createScene: function () {}
        };

        fakeHotspotContainer = {
            createHotspot: function () {}
        };

        fakeScene = {
            switchTo: function () {},
            hotspotContainer: function () {
                return fakeHotspotContainer;
            }
        };


        spyOn(Marzipano, 'Viewer').and.returnValue(fakeViewer);
        spyOn(Marzipano.RectilinearView.limit, 'traditional').and.returnValue('FAKE_VIEW_LIMITER');
        spyOn(Marzipano, 'RectilinearView').and.returnValue(fakeView);
        spyOn(Marzipano.ImageUrlSource, 'fromString').and.returnValue('FAKE_IMAGE_URL_SOURCE');
        spyOn(marzipanoService, 'loadScene').and.callThrough();
        spyOn(Marzipano, 'EquirectGeometry').and.returnValue(fakeCubeGeometery);
        spyOn(fakeViewer, 'createScene').and.returnValue(fakeScene);
        spyOn(fakeView, 'setYaw');
        spyOn(fakeView, 'setPitch');
        spyOn(fakeView, 'setFov');
        spyOn(fakeScene, 'switchTo');
        spyOn(hotspotService, 'createHotspotTemplate').and.callThrough();
        spyOn(fakeHotspotContainer, 'createHotspot');
    });

    it('creates a Marzipano viewer instance when initializing', function () {
        var fakeDomElement,
            viewer;

        fakeDomElement = document.createElement('div');
        viewer = marzipanoService.initialize(fakeDomElement);

        expect(Marzipano.Viewer).toHaveBeenCalledWith(fakeDomElement, jasmine.anything());
        expect(viewer).toEqual(fakeViewer);
    });

    it('uses the extra settings to enable print in Firefox and Safari', function () {
        var fakeDomElement;

        fakeDomElement = document.createElement('div');
        marzipanoService.initialize(fakeDomElement);

        /*
        Make sure stageType is null (autodetect). Which will result in webgl when it's supported with a fallback to 2d
        for ADW.
        */
        expect(Marzipano.Viewer).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
            stageType: null
        }));

        //Don't clear the webgl buffer. Firefox and Safari clear this buffer by default when opening the print dialog
        expect(Marzipano.Viewer).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
            stage: {
                preserveDrawingBuffer: true
            }
        }));
    });

    describe('it has a loadScene function', function () {
        beforeEach(function () {
            var domElement = document.createElement('div');
            marzipanoService.initialize(domElement);
        });

        it('that, ehm, loads a scene', function () {

            marzipanoService.loadScene('example.png',179,1,2, []);

            expect(Marzipano.RectilinearView.limit.traditional).toHaveBeenCalledWith(1000, 50);
            expect(Marzipano.RectilinearView).toHaveBeenCalledWith({}, 'FAKE_VIEW_LIMITER');
            expect(Marzipano.EquirectGeometry).toHaveBeenCalledWith([{ width: 8000 }]);

            expect(fakeViewer.createScene).toHaveBeenCalledWith({
                source: 'FAKE_IMAGE_URL_SOURCE',
                geometry: fakeCubeGeometery,
                view: fakeView,
                pinFirstLevel: true
            });

 
            expect(fakeView.setYaw).toHaveBeenCalledWith(89.5);
            expect(fakeView.setPitch).toHaveBeenCalledWith(0.5);
            expect(fakeView.setFov).toHaveBeenCalledWith(1);
            expect(fakeScene.switchTo).toHaveBeenCalled();


        });

        it('which adds hotspots to the scene', function () {
            var mockedHotspots = [
                {
                    id: 'ABC',
                    distance: 5,
                    heading: 270
                }, {
                    id: 'XYZ',
                    distance: 11,
                    heading:80
                }
            ];

            marzipanoService.loadScene('example.png',179,1,2, mockedHotspots);

            expect(hotspotService.createHotspotTemplate).toHaveBeenCalledTimes(2);

            expect(hotspotService.createHotspotTemplate).toHaveBeenCalledWith( 'XYZ', 11);
            
            expect(hotspotService.createHotspotTemplate).toHaveBeenCalledWith('ABC', 5);

            $rootScope.$apply();
           
            expect(fakeHotspotContainer.createHotspot).toHaveBeenCalledTimes(2);
            expect(fakeHotspotContainer.createHotspot).toHaveBeenCalledWith(
                    'FAKE_HOTSPOT_TEMPLATE', { yaw: 135, pitch: 0.19739555984988078 } );

            expect(fakeHotspotContainer.createHotspot).toHaveBeenCalledWith(
                    'FAKE_HOTSPOT_TEMPLATE', { yaw: 40, pitch: 0.09065988720074511 } );
        });
    });
});
