import { isBusy } from '../../../src/map/services/suppress/suppress';

describe('The onMapClick factory', () => {
    var $rootScope,
        onMapClick,
        store,
        ACTIONS,
        drawTool,
        mockedLeafletMap,
        mockState,
        activeOverlays,
        nearestDetail;

    beforeEach(() => {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: angular.noop,
                    getState: angular.noop
                },
                activeOverlays: {
                    getVisibleOverlays: angular.noop
                },
                nearestDetail: {
                    search: angular.noop
                },
                drawTool: {
                    isEnabled: angular.noop
                }
            }
        );

        let L;

        angular.mock.inject((_$rootScope_, _L_, _onMapClick_, _store_, _ACTIONS_, _drawTool_,
            _activeOverlays_, _nearestDetail_) => {
            $rootScope = _$rootScope_;
            onMapClick = _onMapClick_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            drawTool = _drawTool_;
            L = _L_;
            activeOverlays = _activeOverlays_;
            nearestDetail = _nearestDetail_;
        });

        mockState = {
            ui: {
                isEmbedPreview: false
            },
            map: {
                highlight: true
            }
        };

        spyOn(store, 'getState').and.returnValue(mockState);

        mockedLeafletMap = L.map(document.createElement('div'));

        spyOn(store, 'dispatch');
        spyOn(drawTool, 'isEnabled');
        spyOn(activeOverlays, 'getVisibleOverlays').and.returnValue([]);
        spyOn(nearestDetail, 'search');

        onMapClick.initialize(mockedLeafletMap);

        window.isBusy = isBusy; // eslint-disable-line angular/window-service
    });

    afterEach(() => {
        delete window.isBusy; // eslint-disable-line angular/window-service
    });

    // Mock the Leaflet click event
    function click () {
        mockedLeafletMap.fireEvent('click', {
            latlng: {
                lat: 52.124,
                lng: 4.788
            }
        });
        $rootScope.$apply();
    }

    it('click on map when suppressing is busy it should stop proceeding', () => {
        spyOn(window, 'isBusy').and.returnValue(true);
        click();
        expect(drawTool.isEnabled).not.toHaveBeenCalled();
    });

    it('click on map when in embed preview it should stop proceeding', () => {
        mockState.ui.isEmbedPreview = true;
        click();
        expect(drawTool.isEnabled).not.toHaveBeenCalled();
    });

    it('dispatches an action when the map is clicked and drawtool is not enabled', () => {
        drawTool.isEnabled.and.returnValue(false);
        click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SET_MAP_CLICK_LOCATION.id,
            location: {
                latitude: 52.124,
                longitude: 4.788
            }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_CLICK,
            payload: [52.124, 4.788]
        });
    });

    it('when there are active overlays a search to nearest detail will be called', () => {
        mockState.ui.isEmbedPreview = false;
        activeOverlays.getVisibleOverlays.and.returnValue([1, 2]);
        click();
        expect(nearestDetail.search).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SET_MAP_CLICK_LOCATION.id,
            location: {
                latitude: 52.124,
                longitude: 4.788
            }
        });
        expect(store.dispatch).not.toHaveBeenCalledWith({
            type: ACTIONS.MAP_CLICK,
            payload: [52.124, 4.788]
        });
    });

    it('when there are active overlays and straatbeeld is active a search to nearest detail will not be called', () => {
        mockState.ui.isEmbed = false;
        mockState.straatbeeld = {};
        activeOverlays.getVisibleOverlays.and.returnValue([1, 2]);
        click();
        expect(nearestDetail.search).not.toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SET_MAP_CLICK_LOCATION.id,
            location: {
                latitude: 52.124,
                longitude: 4.788
            }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_CLICK,
            payload: [52.124, 4.788]
        });
    });
});
