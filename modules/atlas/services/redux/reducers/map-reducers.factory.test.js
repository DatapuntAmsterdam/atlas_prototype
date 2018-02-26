describe('The map reducers', function () {
    var mapReducers,
        ACTIONS,
        DEFAULT_STATE;

    DEFAULT_STATE = {
        map: {
            baseLayer: 'topografie',
            overlays: [],
            viewCenter: [52.3719, 4.9012],
            zoom: 9,
            isLoading: false
        },
        filters: {},
        search: null,
        page: {
            name: 'home'
        },
        detail: null,
        straatbeeld: null,
        dataSelection: null,
        ui: {
            isMapFullscreen: false,
            isMapPanelVisible: false,
            isPrintMode: false
        }
    };

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_mapReducers_, _ACTIONS_) {
            mapReducers = _mapReducers_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('SHOW_MAP', () => {
        it('makes the map fullscreen', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            const output = mapReducers[ACTIONS.SHOW_MAP.id](inputState);

            expect(output.ui.isMapFullscreen).toBe(true);
            expect(output.ui.isMapPanelVisible).toBe(true);
        });

        it('when map and map panel are not an object', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map = null;
            inputState.ui = null;

            const output = mapReducers[ACTIONS.SHOW_MAP.id](inputState);
            expect(output.map).toBeNull();
            expect(output.ui).toBeNull();
        });
    });

    describe('MAP_ADD_PANO_OVERLAY', function () {
        it('adds a pano overlay', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.straatbeeld = { history: 2020 };

            const output = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(1);
            expect(output.map.overlays[0].isVisible).toBe(true);
            expect(output.map.overlays[0].id).toBe('pano2020');
        });

        it('defaults to \'pano\' when no history selection exists', function () {
            const inputState = angular.copy(DEFAULT_STATE);

            const output = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(1);
            expect(output.map.overlays[0].isVisible).toBe(true);
            expect(output.map.overlays[0].id).toBe('pano');

            // With existing straatbeeld but without history
            inputState.straatbeeld = {};

            const outputStraatbeeld = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(outputStraatbeeld.map.overlays.length).toBe(1);
            expect(outputStraatbeeld.map.overlays[0].isVisible).toBe(true);
            expect(outputStraatbeeld.map.overlays[0].id).toBe('pano');
        });

        it('removes any pre-existing pano layers', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.overlays.push({
                id: 'pano2020',
                isVisible: true
            });

            const output = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(1);
            expect(output.map.overlays[0].isVisible).toBe(true);
            expect(output.map.overlays[0].id).toBe('pano');

            // With multiple pre-existing pano layers
            inputState.map.overlays.push({
                id: 'pano',
                isVisible: true
            });
            inputState.straatbeeld = { history: 2016 };

            const outputMultiple = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(outputMultiple.map.overlays.length).toBe(1);
            expect(outputMultiple.map.overlays[0].isVisible).toBe(true);
            expect(outputMultiple.map.overlays[0].id).toBe('pano2016');
        });

        it('does not add an already active layer', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.overlays.push({
                id: 'pano',
                isVisible: true
            });

            const output = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(1);
            expect(output.map.overlays[0].isVisible).toBe(true);
            expect(output.map.overlays[0].id).toBe('pano');
        });

        it('appends to other active layers', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.overlays.push({
                id: 'a',
                isVisible: true
            });

            const output = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays).toEqual([{
                id: 'a',
                isVisible: true
            }, {
                id: 'pano',
                isVisible: true
            }]);

            // With pano overlay and other overlays
            inputState.map.overlays.push({
                id: 'pano2016',
                isVisible: true
            });
            inputState.map.overlays.push({
                id: 'b',
                isVisible: false
            });

            const outputOthers = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(outputOthers.map.overlays).toEqual([{
                id: 'a',
                isVisible: true
            }, {
                id: 'b',
                isVisible: false
            }, {
                id: 'pano',
                isVisible: true
            }]);

            // With pano overlays and another overlay
            inputState.map.overlays.push({
                id: 'pano2018',
                isVisible: true
            });
            inputState.map.overlays.shift();

            const outputOther = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(outputOther.map.overlays).toEqual([{
                id: 'b',
                isVisible: false
            }, {
                id: 'pano',
                isVisible: true
            }]);
        });

        it('when map is not an object', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map = null;

            const output = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(output.map).toBeNull();
        });
    });

    describe('MAP_REMOVE_PANO_OVERLAY', function () {
        it('removes the active pano overlay', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.overlays.push({
                id: 'pano',
                isVisible: true
            });

            const output = mapReducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(0);
        });

        it('removes all active pano overlays', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.overlays.push({
                id: 'pano',
                isVisible: true
            });
            inputState.map.overlays.push({
                id: 'pano2020',
                isVisible: true
            });

            const output = mapReducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(0);
        });

        it('leaves other active overlays be', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.overlays.push({
                id: 'a',
                isVisible: true
            });
            inputState.map.overlays.push({
                id: 'pano2016',
                isVisible: true
            });
            inputState.map.overlays.push({
                id: 'b',
                isVisible: false
            });
            inputState.map.overlays.push({
                id: 'pano2019',
                isVisible: true
            });
            inputState.map.overlays.push({
                id: 'c',
                isVisible: true
            });

            const output = mapReducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays).toEqual([{
                id: 'a',
                isVisible: true
            }, {
                id: 'b',
                isVisible: false
            }, {
                id: 'c',
                isVisible: true
            }]);
        });

        it('does nothing when there are no active pano overlays', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            const output = mapReducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(0);

            // With other active overlays
            inputState.map.overlays.push({
                id: 'a',
                isVisible: false
            });
            inputState.map.overlays.push({
                id: 'b',
                isVisible: true
            });
            inputState.map.overlays.push({
                id: 'c',
                isVisible: false
            });

            const outputWithLayers = mapReducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id](inputState);
            expect(outputWithLayers.map.overlays).toEqual([{
                id: 'a',
                isVisible: false
            }, {
                id: 'b',
                isVisible: true
            }, {
                id: 'c',
                isVisible: false
            }]);
        });

        it('when map is not an object', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map = null;

            const output = mapReducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id](inputState);
            expect(output.map).toBeNull();
        });
    });

    describe('MAP_PAN', function () {
        it('updates the viewCenter', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_PAN.id](inputState, [51.1, 4.1]);
            expect(output.map.viewCenter).toEqual([51.1, 4.1]);

            output = mapReducers[ACTIONS.MAP_PAN.id](inputState, [51.2, 4.2]);
            expect(output.map.viewCenter).toEqual([51.2, 4.2]);
        });

        it('when map is not an object', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map = null;

            const output = mapReducers[ACTIONS.MAP_PAN.id](inputState);
            expect(output.map).toBeNull();
        });
    });

    describe('MAP_ZOOM', function () {
        it('can update the zoom and viewCenter property', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_ZOOM.id](inputState, {
                viewCenter: [4.9012, 52.3719],
                zoom: 8
            });
            expect(output.map.viewCenter).toEqual([4.9012, 52.3719]);
            expect(output.map.zoom).toBe(8);

            output = mapReducers[ACTIONS.MAP_ZOOM.id](inputState, {
                viewCenter: [52.3719, 4.9012],
                zoom: 15
            });
            expect(output.map.viewCenter).toEqual([52.3719, 4.9012]);
            expect(output.map.zoom).toBe(15);

            output = mapReducers[ACTIONS.MAP_ZOOM.id](inputState, {
                viewCenter: [53, 5],
                zoom: 16
            });
            expect(output.map.viewCenter).toEqual([53, 5]);
            expect(output.map.zoom).toBe(16);
        });

        it('doesn\'t have to update the optional viewCenter property', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_ZOOM.id](inputState, {
                zoom: 8
            });
            expect(output.map.viewCenter).toEqual([52.3719, 4.9012]);
            expect(output.map.zoom).toBe(8);
        });

        it('when map is not an object', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map = null;

            const output = mapReducers[ACTIONS.MAP_ZOOM.id](inputState);
            expect(output.map).toBeNull();
        });
    });

    describe('MAP_HIGHLIGHT', function () {
        it('can toggle the fullscreen mode', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            let output;

            // Enable fullscreen
            output = mapReducers[ACTIONS.MAP_HIGHLIGHT.id](inputState, true);
            expect(output.map.highlight).toBe(true);

            // Disable fullscreen
            output = mapReducers[ACTIONS.MAP_HIGHLIGHT.id](inputState, false);
            expect(output.map.highlight).toBe(false);
        });

        it('when map is not an object', function () {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map = null;

            const output = mapReducers[ACTIONS.MAP_HIGHLIGHT.id](inputState);
            expect(output.map).toBeNull();
        });
    });
});
