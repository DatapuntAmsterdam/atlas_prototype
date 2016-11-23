describe('The map reducers', function () {
    var mapReducers,
        ACTIONS,
        DEFAULT_STATE;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_mapReducers_, _ACTIONS_, _DEFAULT_STATE_) {
            mapReducers = _mapReducers_;
            ACTIONS = _ACTIONS_;
            DEFAULT_STATE = _DEFAULT_STATE_;
        });
    });

    describe('MAP_SET_BASELAYER', function () {
        it('changes the baseLayer', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_SET_BASELAYER.id](inputState, 'luchtfoto_1915');
            expect(output.map.baseLayer).toBe('luchtfoto_1915');

            output = mapReducers[ACTIONS.MAP_SET_BASELAYER.id](inputState, 'topografie');
            expect(output.map.baseLayer).toBe('topografie');
        });
    });

    describe('MAP_ADD_OVERLAY', function () {
        it('adds an overlay', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_ADD_OVERLAY.id](inputState, 'meetbouten');
            expect(output.map.overlays.length).toBe(1);
            expect(output.map.overlays[0].isVisible).toBe(true);
            expect(output.map.overlays[0].id).toBe('meetbouten');

            output = mapReducers[ACTIONS.MAP_ADD_OVERLAY.id](output, 'parkeren');
            expect(output.map.overlays[1].isVisible).toBe(true);
            expect(output.map.overlays[1].id).toBe('parkeren');

            expect(output.map.overlays.length).toBe(2);
        });

        it('opens the active overlays panel if there were no active overlays before', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            // When there were no active overlays; open the active overlays panel
            inputState.map.showActiveOverlays = false;
            output = mapReducers[ACTIONS.MAP_ADD_OVERLAY.id](inputState, 'meetbouten');
            expect(output.map.showActiveOverlays).toBe(true);

            // When there already were active overlays; do nothing
            inputState.map.showActiveOverlays = false;
            inputState.map.overlays = [{id: 'nap', isVisible: true}];
            output = mapReducers[ACTIONS.MAP_ADD_OVERLAY.id](inputState, 'meetbouten');
            expect(output.map.showActiveOverlays).toBe(false);
        });
    });

    describe('MAP_REMOVE_OVERLAY', function () {
        it('removes an overlay', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.map.overlays = [
                {
                    id: 'overlay_1',
                    isVisible: true
                }, {
                    id: 'overlay_2',
                    isVisible: true
                }, {
                    id: 'overlay_3',
                    isVisible: true
                }];

            output = mapReducers[ACTIONS.MAP_REMOVE_OVERLAY.id](inputState, 'overlay_2');
            expect(output.map.overlays).toEqual([
                {id: 'overlay_1', isVisible: true},
                {id: 'overlay_3', isVisible: true}
            ]);
        });

        it('will always keep the overlays state property an array (instead of null)', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.map.overlays = [{id: 'parkeren', isVisible: true}];

            output = mapReducers[ACTIONS.MAP_REMOVE_OVERLAY.id](inputState, 'parkeren');
            expect(output.map.overlays).toEqual([]);
        });
    });

    describe('MAP_TOGGILE_VISIBILITY', function () {
        it('hides an overlay', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.map.overlays = [
                {
                    id: 'overlay_1',
                    isVisible: true
                }, {
                    id: 'overlay_2',
                    isVisible: true
                }, {
                    id: 'overlay_3',
                    isVisible: true
                }];

            output = mapReducers[ACTIONS.MAP_TOGGLE_VISIBILITY_OVERLAY.id](inputState, 'overlay_2');
            expect(output.map.overlays).toEqual([
                {id: 'overlay_1', isVisible: true},
                {id: 'overlay_2', isVisible: false},
                {id: 'overlay_3', isVisible: true}
            ]);
        });

        it('hides an overlay', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.map.overlays = [
                {
                    id: 'overlay_1',
                    isVisible: false
                }, {
                    id: 'overlay_2',
                    isVisible: true
                }, {
                    id: 'overlay_3',
                    isVisible: true
                }];

            output = mapReducers[ACTIONS.MAP_TOGGLE_VISIBILITY_OVERLAY.id](inputState, 'overlay_1');
            expect(output.map.overlays).toEqual([
                {id: 'overlay_1', isVisible: true},
                {id: 'overlay_2', isVisible: true},
                {id: 'overlay_3', isVisible: true}
            ]);
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
    });

    describe('MAP_FULLSCREEN', function () {
        it('can toggle the fullscreen mode', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            // Enable fullscreen
            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, true);
            expect(output.map.isFullscreen).toBe(true);

            // Disable fullscreen
            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, false);
            expect(output.map.isFullscreen).toBe(false);
        });

        it('when enabling fullscreen, the layer selection will be disabled', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.layerSelection = true;

            // Enable fullscreen
            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, true);
            expect(output.layerSelection).toBe(false);
        });

        it('when straatbeeld exists, reactivates it on minimize', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.straatbeeld = {
                id: 'abc',
                isInvisible: true
            };

            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, false);
            expect(output.straatbeeld.isInvisible).toBe(false);
        });

        it('when straatbeeld exists, hide it on maximize', function () {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.straatbeeld = {
                id: 'abc'
            };

            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, true);
            expect(output.straatbeeld.isInvisible).toBe(true);
        });
    });

    describe('SHOW_MAP_ACTIVE_OVERLAYS', function () {
        it('sets the variable to true', function () {
            var output;

            output = mapReducers[ACTIONS.SHOW_MAP_ACTIVE_OVERLAYS.id](DEFAULT_STATE);
            expect(output.map.showActiveOverlays).toBe(true);
        });
    });

    describe('HIDE_MAP_ACTIVE_OVERLAYS', function () {
        it('sets the variable to false', function () {
            var output,
                inputState = angular.copy(DEFAULT_STATE);

            inputState.map.showActiveOverlays = true;
            output = mapReducers[ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS.id](DEFAULT_STATE);
            expect(output.map.showActiveOverlays).toBe(false);
        });
    });
});
