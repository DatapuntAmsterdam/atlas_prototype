describe('The map reducers', () => {
    var mapReducers,
        ACTIONS,
        DEFAULT_STATE,
        DRAW_TOOL_CONFIG;

    DEFAULT_STATE = {
        map: {
            baseLayer: 'topografie',
            overlays: [],
            viewCenter: [52.3719, 4.9012],
            zoom: 9,
            showActiveOverlays: false,
            isFullscreen: false,
            isLoading: false
        },
        layerSelection: {
            isEnabled: false
        },
        search: null,
        page: {
            name: 'home'
        },
        detail: null,
        straatbeeld: null,
        dataSelection: null,
        atlas: {
            isPrintMode: false
        }
    };

    beforeEach(() => {
        angular.mock.module('atlas');

        angular.mock.inject((_mapReducers_, _ACTIONS_, _DRAW_TOOL_CONFIG_) => {
            mapReducers = _mapReducers_;
            ACTIONS = _ACTIONS_;
            DRAW_TOOL_CONFIG = _DRAW_TOOL_CONFIG_;
        });
    });

    describe('SHOW_MAP', () => {
        it('makes the map fullscreen', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            const output = mapReducers[ACTIONS.SHOW_MAP.id](inputState);

            expect(output.map.isFullscreen).toBe(true);
        });

        it('opens layerSelection', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            const output = mapReducers[ACTIONS.SHOW_MAP.id](inputState);

            expect(output.layerSelection.isEnabled).toBe(true);
        });
    });

    describe('MAP_SET_BASELAYER', () => {
        it('changes the baseLayer', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_SET_BASELAYER.id](inputState, 'luchtfoto_1915');
            expect(output.map.baseLayer).toBe('luchtfoto_1915');

            output = mapReducers[ACTIONS.MAP_SET_BASELAYER.id](inputState, 'topografie');
            expect(output.map.baseLayer).toBe('topografie');
        });
    });

    describe('MAP_ADD_OVERLAY', () => {
        it('adds an overlay', () => {
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

        it('opens the active overlays panel if there were no active overlays before', () => {
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

        it('opens the active overlays panel if there were only active pano overlays before', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            // When there is only a pano layer active; open the active overlays panel
            inputState.map.showActiveOverlays = false;
            inputState.map.overlays = [{id: 'pano', isVisible: true}];
            output = mapReducers[ACTIONS.MAP_ADD_OVERLAY.id](inputState, 'meetbouten');
            expect(output.map.showActiveOverlays).toBe(true);

            // When there is only another pano layer active; open the active overlays panel
            inputState.map.showActiveOverlays = false;
            inputState.map.overlays = [{id: 'pano2020', isVisible: true}];
            output = mapReducers[ACTIONS.MAP_ADD_OVERLAY.id](inputState, 'meetbouten');
            expect(output.map.showActiveOverlays).toBe(true);

            // When there are only multiple pano layers active; open the active overlays panel
            inputState.map.showActiveOverlays = false;
            inputState.map.overlays = [
                {id: 'pano', isVisible: true},
                {id: 'pano2020', isVisible: true}
            ];
            output = mapReducers[ACTIONS.MAP_ADD_OVERLAY.id](inputState, 'meetbouten');
            expect(output.map.showActiveOverlays).toBe(true);

            // When there already were active (non-pano) overlays; do nothing
            inputState.map.showActiveOverlays = false;
            inputState.map.overlays = [
                {id: 'pano', isVisible: true},
                {id: 'pano2020', isVisible: true},
                {id: 'nap', isVisible: true}
            ];
            output = mapReducers[ACTIONS.MAP_ADD_OVERLAY.id](inputState, 'meetbouten');
            expect(output.map.showActiveOverlays).toBe(false);
        });
    });

    describe('MAP_REMOVE_OVERLAY', () => {
        it('removes an overlay', () => {
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

        it('will always keep the overlays state property an array (instead of null)', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.map.overlays = [{id: 'parkeren', isVisible: true}];

            output = mapReducers[ACTIONS.MAP_REMOVE_OVERLAY.id](inputState, 'parkeren');
            expect(output.map.overlays).toEqual([]);
        });
    });

    describe('MAP_ADD_PANO_OVERLAY', () => {
        it('adds a pano overlay', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.straatbeeld = { history: 2020 };

            const output = mapReducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(1);
            expect(output.map.overlays[0].isVisible).toBe(true);
            expect(output.map.overlays[0].id).toBe('pano2020');
        });

        it('defaults to \'pano\' when no history selection exists', () => {
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

        it('removes any pre-existing pano layers', () => {
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

        it('does not add an already active layer', () => {
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

        it('appends to other active layers', () => {
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
    });

    describe('MAP_REMOVE_PANO_OVERLAY', () => {
        it('removes the active pano overlay', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.overlays.push({
                id: 'pano',
                isVisible: true
            });

            const output = mapReducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id](inputState);
            expect(output.map.overlays.length).toBe(0);
        });

        it('removes all active pano overlays', () => {
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

        it('leaves other active overlays be', () => {
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

        it('does nothing when there are no active pano overlays', () => {
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
    });

    describe('MAP_TOGGLE_VISIBILITY_OVERLAY', () => {
        it('hides an overlay', () => {
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

        it('hides an overlay', () => {
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

    describe('MAP_PAN', () => {
        it('updates the viewCenter', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_PAN.id](inputState, [51.1, 4.1]);
            expect(output.map.viewCenter).toEqual([51.1, 4.1]);

            output = mapReducers[ACTIONS.MAP_PAN.id](inputState, [51.2, 4.2]);
            expect(output.map.viewCenter).toEqual([51.2, 4.2]);
        });
    });

    describe('MAP_ZOOM', () => {
        it('can update the zoom and viewCenter property', () => {
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

        it('doesn\'t have to update the optional viewCenter property', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_ZOOM.id](inputState, {
                zoom: 8
            });
            expect(output.map.viewCenter).toEqual([52.3719, 4.9012]);
            expect(output.map.zoom).toBe(8);
        });
    });

    describe('MAP_FULLSCREEN', () => {
        it('can toggle the fullscreen mode', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            let output;

            // Enable fullscreen
            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, true);
            expect(output.map.isFullscreen).toBe(true);

            // Disable fullscreen
            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, false);
            expect(output.map.isFullscreen).toBe(false);
        });

        it('disables layer selection when changing fullscreen', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            let output;

            // Enable fullscreen
            inputState.map.isFullscreen = false;
            inputState.layerSelection.isEnabled = true;
            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, true);
            expect(output.layerSelection.isEnabled).toBe(false);

            // Disable fullscreen
            inputState.map.isFullscreen = true;
            inputState.layerSelection.isEnabled = true;
            output = mapReducers[ACTIONS.MAP_FULLSCREEN.id](inputState, false);
            expect(output.layerSelection.isEnabled).toBe(false);
        });
    });

    describe('MAP_START_DRAWING', () => {
        it('Set the map drawing mode to draw and not to reset dataSelection', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = 'leave this as it is';
            output = mapReducers[ACTIONS.MAP_START_DRAWING.id](inputState, DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW);
            expect(output.map.drawingMode).toBe(DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW);
            expect(output.dataSelection).toBe('leave this as it is');
        });

        it('Set the map drawing mode to edit and not to reset dataSelection', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = 'leave this as it is';
            output = mapReducers[ACTIONS.MAP_START_DRAWING.id](inputState, DRAW_TOOL_CONFIG.DRAWING_MODE.EDIT);
            expect(output.map.drawingMode).toBe(DRAW_TOOL_CONFIG.DRAWING_MODE.EDIT);
            expect(output.dataSelection).toBe('leave this as it is');
        });

        it('Should reset dataSelection state only when markers are on the map and draw mode is not edit', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = { geometryFilter: { markers: [1, 2] } };

            output = mapReducers[ACTIONS.MAP_START_DRAWING.id](inputState, DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW);
            expect(output.dataSelection.geometryFilter).toEqual({markers: []});
            expect(output.dataSelection.page).toBe(1);
            expect(output.dataSelection.isFullscreen).toBe(false);
            expect(output.dataSelection.isLoading).toBe(true);
            expect(output.dataSelection.view).toBe('LIST');
            expect(output.dataSelection.markers).toEqual([]);
            expect(output.dataSelection.reset).toBe(true);
        });

        it('Should not reset dataSelection state with markers on the map and draw mode is edit', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = { geometryFilter: { markers: [1] } };

            output = mapReducers[ACTIONS.MAP_START_DRAWING.id](inputState, DRAW_TOOL_CONFIG.DRAWING_MODE.EDIT);
            expect(output.dataSelection.geometryFilter).toEqual({ markers: [1] });
            expect(output.dataSelection.page).toBeUndefined();
            expect(output.dataSelection.reset).toBeFalsy();
        });

        it('Should not reset dataSelection state with no markers on the map and draw mode is not edit', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = { geometryFilter: { markers: [] } };

            output = mapReducers[ACTIONS.MAP_START_DRAWING.id](inputState, DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW);
            expect(output.dataSelection.page).toBeUndefined();
            expect(output.dataSelection.reset).toBeFalsy();
        });
    });

    describe('MAP_CLEAR_DRAWING', () => {
        it('Clears the map geometry', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.map.geometry = 'aap';
            output = mapReducers[ACTIONS.MAP_CLEAR_DRAWING.id](inputState);
            expect(output.map.geometry).toEqual([]);
        });
    });

    describe('MAP_END_DRAWING', () => {
        it('Set the map drawing mode to false', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: []
            });
            expect(output.map.drawingMode).toBe(DRAW_TOOL_CONFIG.DRAWING_MODE.NONE);
        });

        it('resets the page with more than 2 markers', () => {
            const inputState = angular.copy(DEFAULT_STATE);

            const output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: ['noot', 'mies', 'teun']
            });
            expect(output.page.name).toBeNull();
            expect(output.dataSelection.reset).toBeFalsy();
        });

        it('Leaves the dataSelection state untouched on an argument polygon with <= 1 markers', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = 'aap';
            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: ['noot']
            });
            expect(output.dataSelection).toBe('aap');

            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: []
            });
            expect(output.dataSelection).toBe('aap');
        });

        it('Sets the map geometry on a polygon with 2 markers', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: ['noot', 'mies']
            });
            expect(output.map.geometry).toEqual(['noot', 'mies']);
            expect(output.page.name).toBe('home');
        });

        it('Initializes the dataSelection state when a payload is specified', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = null;
            const geometryFilter = {
                markers: ['noot', 'mies', 'teun'],
                description: 'description'
            };
            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, geometryFilter);
            expect(output.dataSelection).not.toBe(null);
            expect(output.dataSelection.geometryFilter).toEqual(geometryFilter);
        });

        it('Does not initialize the dataSelection state when payload is missing', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = 'aap';
            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState);
            expect(output.dataSelection).toBe('aap');
        });

        it('Leaves dataset and filters of an existing dataSelection state untouched', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = {
                dataset: 'aap',
                filters: 'noot'
            };
            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: ['noot', 'mies', 'teun']
            });
            ['dataset', 'filters'].forEach(key =>
                expect(output.dataSelection[key]).toEqual(inputState.dataSelection[key])
            );
        });

        it('Sets  dataset and filters of an existing dataSelection state untouched', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            inputState.dataSelection = {
                dataset: 'aap',
                filters: 'noot'
            };
            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: ['noot', 'mies', 'teun']
            });
            ['dataset', 'filters'].forEach(key =>
                expect(output.dataSelection[key]).toEqual(inputState.dataSelection[key])
            );
        });

        it('Sets page, fullscreen, loading, view and markers of the dataSelection state', () => {
            var inputState = angular.copy(DEFAULT_STATE),
                output;

            output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: ['noot', 'mies', 'teun']
            });
            expect(output.dataSelection.geometryFilter).toEqual({
                markers: ['noot', 'mies', 'teun']
            });
            expect(output.dataSelection.page).toBe(1);
            expect(output.dataSelection.isFullscreen).toBe(false);
            expect(output.dataSelection.isLoading).toBe(true);
            expect(output.dataSelection.view).toBe('LIST');
            expect(output.dataSelection.markers).toEqual([]);
        });

        it('Closes the full screen map and layer selection on polygon and sets map to be loading', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.isLoading = false;
            inputState.map.isFullscreen = true;
            inputState.layerSelection.isEnabled = true;

            const output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: ['p1', 'p2', 'p3']
            });

            expect(output.map.isFullscreen).toBe(false);
            expect(output.map.isLoading).toBe(true);
            expect(output.layerSelection.isEnabled).toBe(false);
        });

        it('Does not close full screen map and layer selection on line and does not set map to be loading', () => {
            const inputState = angular.copy(DEFAULT_STATE);
            inputState.map.isLoading = false;
            inputState.map.isFullscreen = true;
            inputState.layerSelection.isEnabled = true;

            const output = mapReducers[ACTIONS.MAP_END_DRAWING.id](inputState, {
                markers: ['p1', 'p2']
            });

            expect(output.map.isFullscreen).toBe(true);
            expect(output.map.isLoading).toBe(false);
            expect(output.layerSelection.isEnabled).toBe(true);
        });
    });

    describe('SHOW_MAP_ACTIVE_OVERLAYS', () => {
        it('sets the variable to true', () => {
            var output;

            output = mapReducers[ACTIONS.SHOW_MAP_ACTIVE_OVERLAYS.id](DEFAULT_STATE);
            expect(output.map.showActiveOverlays).toBe(true);
        });
    });

    describe('HIDE_MAP_ACTIVE_OVERLAYS', () => {
        it('sets the variable to false', () => {
            var output,
                inputState = angular.copy(DEFAULT_STATE);

            inputState.map.showActiveOverlays = true;
            output = mapReducers[ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS.id](DEFAULT_STATE);
            expect(output.map.showActiveOverlays).toBe(false);
        });
    });
});
