describe('The map reducers', function () {
    var mapReducers,
        defaultState;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_mapReducers_, _DEFAULT_STATE_) {
            mapReducers = _mapReducers_;
            defaultState = _DEFAULT_STATE_;
        });
    });

    describe('MAP_SET_BASELAYER', function () {
        it('changes the baseLayer', function () {
            var inputState = angular.copy(defaultState),
                output;

            output = mapReducers.MAP_SET_BASELAYER(inputState, 'luchtfoto_1915');
            expect(output.map.baseLayer).toBe('luchtfoto_1915');

            output = mapReducers.MAP_SET_BASELAYER(inputState, 'topografie');
            expect(output.map.baseLayer).toBe('topografie');
        });
    });

    describe('MAP_ADD_OVERLAY', function () {
        it('adds an overlay', function () {
            var inputState = angular.copy(defaultState),
                output;

            output = mapReducers.MAP_ADD_OVERLAY(inputState, 'meetbouten');
            expect(output.map.overlays.length).toBe(1);
            expect(output.map.overlays[0].isVisible).toBe(true);
            expect(output.map.overlays[0].id).toBe('meetbouten');

            output = mapReducers.MAP_ADD_OVERLAY(output, 'parkeren');
            expect(output.map.overlays[1].isVisible).toBe(true);
            expect(output.map.overlays[1].id).toBe('parkeren');

            expect(output.map.overlays.length).toBe(2);
        });
    });

    describe('MAP_REMOVE_OVERLAY', function () {
        it('removes an overlay', function () {
            var inputState = angular.copy(defaultState),
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

            output = mapReducers.MAP_REMOVE_OVERLAY(inputState, 'overlay_2');
            expect(output.map.overlays).toEqual([
                {id: 'overlay_1', isVisible: true},
                {id: 'overlay_3', isVisible: true}
            ]);
        });

        it('will always keep the overlays state property an array (instead of null)', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.map.overlays = [{id: 'parkeren', isVisible: true}];

            output = mapReducers.MAP_REMOVE_OVERLAY(inputState, 'parkeren');
            expect(output.map.overlays).toEqual([]);
        });
    });
    describe('MAP_TOGGILE_VISIBILITY', function() {
        it('hides an overlay', function() {
            var inputState = angular.copy(defaultState),
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

            output = mapReducers.MAP_TOGGLE_VISIBILITY_OVERLAY(inputState, 'overlay_2');
            expect(output.map.overlays).toEqual([
                {id: 'overlay_1', isVisible: true},
                {id: 'overlay_2', isVisible: false},
                {id: 'overlay_3', isVisible: true}
            ]);
        });
        it('hides an overlay', function() {
            var inputState = angular.copy(defaultState),
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

            output = mapReducers.MAP_TOGGLE_VISIBILITY_OVERLAY(inputState, 'overlay_1');
            expect(output.map.overlays).toEqual([
                {id: 'overlay_1', isVisible: true},
                {id: 'overlay_2', isVisible: true},
                {id: 'overlay_3', isVisible: true}
            ]);
        });
    });
    describe('MAP_PAN', function () {
        it('updates the viewCenter', function () {
            var inputState = angular.copy(defaultState),
                output;

            output = mapReducers.MAP_PAN(inputState, [51.1, 4.1]);
            expect(output.map.viewCenter).toEqual([51.1, 4.1]);

            output = mapReducers.MAP_PAN(inputState, [51.2, 4.2]);
            expect(output.map.viewCenter).toEqual([51.2, 4.2]);
        });
    });

    describe('MAP_ZOOM', function () {
        it('can update the zoom and viewCenter property', function () {
            var inputState = angular.copy(defaultState),
                output;

            output = mapReducers.MAP_ZOOM(inputState, {
                viewCenter: [4.9012, 52.3719],
                zoom: 8
            });
            expect(output.map.viewCenter).toEqual([4.9012, 52.3719]);
            expect(output.map.zoom).toBe(8);

            output = mapReducers.MAP_ZOOM(inputState, {
                viewCenter: [52.3719, 4.9012],
                zoom: 15
            });
            expect(output.map.viewCenter).toEqual([52.3719, 4.9012]);
            expect(output.map.zoom).toBe(15);

            output = mapReducers.MAP_ZOOM(inputState, {
                viewCenter: [53, 5],
                zoom: 16
            });
            expect(output.map.viewCenter).toEqual([53, 5]);
            expect(output.map.zoom).toBe(16);
        });

        it('doesn\'t have to update the optional viewCenter property', function () {
            var inputState = angular.copy(defaultState),
                output;

            output = mapReducers.MAP_ZOOM(inputState, {
                zoom: 8
            });
            expect(output.map.viewCenter).toEqual([52.3719, 4.9012]);
            expect(output.map.zoom).toBe(8);
        });
    });

    describe('MAP_FULLSCREEN', function () {
        it('can toggle the fullscreen mode', function () {
            var inputState = angular.copy(defaultState),
                output;

            //Enable fullscreen
            output = mapReducers.MAP_FULLSCREEN(inputState, true);
            expect(output.map.isFullscreen).toBe(true);

            //Disable fullscreen
            output = mapReducers.MAP_FULLSCREEN(inputState, false);
            expect(output.map.isFullscreen).toBe(false);
        });
    });
});