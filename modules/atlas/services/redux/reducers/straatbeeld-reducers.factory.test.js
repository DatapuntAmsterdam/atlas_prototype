describe('The straatbeeldReducers factory', function () {
    var straatbeeldReducers,
        defaultState,
        inputStateWithStraatbeeld;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_straatbeeldReducers_, _DEFAULT_STATE_) {
            straatbeeldReducers = _straatbeeldReducers_;
            defaultState = _DEFAULT_STATE_;
        });

        inputStateWithStraatbeeld = angular.copy(defaultState);

        inputStateWithStraatbeeld.straatbeeld = {
            id: 1,
            location: null,
            date: new Date(2016, 6 , 12),
            car: {
                location: [51.0, 4.0],
                heading: 180,
                pitch: 0.2
            },
            camera: {
                heading: 90,
                pitch: 0.5,
                fov: 75
            },
            hotspots: ['FAKE_HOTSPOT_A', 'FAKE_HOTSPOT_Z'],
            isLoading: false
        };
    });

    describe('FETCH_STRAATBEELD', function () {
        describe('can have a reference to a panorama scene', function () {
            it('by ID', function () {
                var inputState = angular.copy(defaultState),
                    output;

                output = straatbeeldReducers.FETCH_STRAATBEELD(inputState, {id: 123, heading: 180 });

                expect(output.straatbeeld.id).toBe(123);
                expect(output.straatbeeld.searchLocation).toBeNull();
            });

            it('or by location', function () {
                var inputState = angular.copy(defaultState),
                    output;

                output = straatbeeldReducers.FETCH_STRAATBEELD(inputState, {id: [52.987, 4.321], heading: 180});

                expect(output.straatbeeld.id).toBeNull();
                expect(output.straatbeeld.searchLocation).toEqual([52.987, 4.321]);
            });
        });

        it('resets the straatbeeld variables for date, car and hotspots', function () {
            var inputState = angular.copy(inputStateWithStraatbeeld),
                output;

            output = straatbeeldReducers.FETCH_STRAATBEELD(inputState, {id: 123, heading: 180 });

            expect(output.straatbeeld.date).toBeNull();
            expect(angular.isArray(output.straatbeeld.hotspots)).toBe(true);
            expect(output.straatbeeld.hotspots.length).toBe(0);
        });

       it('remembers the previous camera state (if any)', function () {
            var inputState = angular.copy(inputStateWithStraatbeeld),
                output;

            //With a known previous camera orientation
            output = straatbeeldReducers.FETCH_STRAATBEELD(inputState, {id: 123, heading: 180 });
            expect(output.straatbeeld.camera).toEqual({
                heading: 90,
                pitch: 0.5,
                fov: 75
            });

            //Without a known camera orientation
            inputState = angular.copy(defaultState);
            output = straatbeeldReducers.FETCH_STRAATBEELD(inputState, { id: 123, heading: 180 });
            expect(output.straatbeeld.camera).toBeNull();
        });

       it('sets a loading indicator for straatbeeld and the map', function () {
            var inputState = angular.copy(defaultState),
                output;

            output = straatbeeldReducers.FETCH_STRAATBEELD(inputState, {id: 123, heading: 180 });

            expect(output.straatbeeld.isLoading).toBe(true);
            expect(output.map.isLoading).toBe(true);
        });

        it('removes the highlighted object from the map', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.map.highlight = {some: 'object'};

            output = straatbeeldReducers.FETCH_STRAATBEELD(inputState, 123);

            expect(output.map.highlight).toBeNull();
        });

        it('resets search, detail and page', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.search = {some: 'object'};
            inputState.detail = {some: 'object'};
            inputState.page = 'somePage';

            output = straatbeeldReducers.FETCH_STRAATBEELD(inputState, 123);

            expect(output.search).toBeNull();
            expect(output.detail).toBeNull();
            expect(output.page).toBeNull();
        });
    });

    describe('SHOW_STRAATBEELD_INITIAL', function () {
        var showStraatbeeldPayload;

        beforeEach(function () {
            showStraatbeeldPayload = {
                id: 98765,
                date: new Date(2016, 6, 8),
                car: {
                    location: [51.5, 4.5],
                    heading: 240,
                    pitch: 0.01
                },
                hotspots: ['FAKE_HOTSPOT_A', 'FAKE_HOTSPOT_B']
            };
        });

        it('sets the ID when searching by location and it removes the search location', function () {
            var inputState = angular.copy(inputStateWithStraatbeeld),
                output;

            inputState.straatbeeld.id = null;
            inputState.straatbeeld.searchLocation = [52.4, 4.52];

            output = straatbeeldReducers.SHOW_STRAATBEELD_INITIAL(inputState, showStraatbeeldPayload);

            expect(output.straatbeeld.id).toBe(98765);
            expect(output.straatbeeld.searchLocation).toBeNull();
        });

        it('sets the date, car and hotspots variables', function () {
            var inputState = angular.copy(inputStateWithStraatbeeld),
                output;

            output = straatbeeldReducers.SHOW_STRAATBEELD_INITIAL(inputState, showStraatbeeldPayload);

            expect(output.straatbeeld.date).toEqual(new Date(2016, 6, 8));
            expect(output.straatbeeld.car).toEqual({
                location: [51.5, 4.5],
                heading: 240,
                pitch: 0.01
            });
            expect(output.straatbeeld.hotspots).toEqual(['FAKE_HOTSPOT_A', 'FAKE_HOTSPOT_B']);
        });

        it('sets the camera orientation', function () {
            var inputState = angular.copy(inputStateWithStraatbeeld),
                output;

            //It keeps the previous camera orientation
            output = straatbeeldReducers.SHOW_STRAATBEELD_INITIAL(inputState, showStraatbeeldPayload);
            expect(output.straatbeeld.camera).toEqual({
                heading: 90,
                pitch: 0.5,
                fov: 75
            });

            //Or it copies the values from the car orientation if there is no previous camera orientation
            inputState.straatbeeld.camera = null;
            output = straatbeeldReducers.SHOW_STRAATBEELD_INITIAL(inputState, showStraatbeeldPayload);
            expect(output.straatbeeld.camera).toEqual({
                heading: 240,
                pitch: 0.01
            });
        });

        it('removes the loading indicators from the map and straatbeeld', function () {
            var inputState = angular.copy(inputStateWithStraatbeeld),
                output;

            inputState.map.isLoading = true;
            inputState.straatbeeld.isLoading = true;

            output = straatbeeldReducers.SHOW_STRAATBEELD_INITIAL(inputStateWithStraatbeeld, showStraatbeeldPayload);

            expect(output.map.isLoading).toBe(false);
            expect(output.straatbeeld.isLoading).toBe(false);
        });

        it('does nothing when straatbeeld is null', function () {
            /**
             * This can happen when a user triggers another action after FETCH_STRAATBEELD and before
             * SHOW_STRAATBEELD_INITIAL OR SHOW_STRAATBEELD_SUBSEQUENT
             */
            var inputState = angular.copy(defaultState),
                output;

     
            expect(inputState.straatbeeld).toBeNull();
            output = straatbeeldReducers.SHOW_STRAATBEELD_INITIAL(inputState, showStraatbeeldPayload);
 
            expect(output.straatbeeld).toBeNull();
        });
    });

    it('STRAATBEELD_SHOW_SUBSEQUENT calls the same reducer as STRAATBEELD_SHOW_INITIAL', function () {
        //The distinction between these actions lies in the routing middleware, the actual reducer is the same
        expect(straatbeeldReducers.SHOW_STRAATBEELD_INITIAL).toEqual(straatbeeldReducers.SHOW_STRAATBEELD_SUBSEQUENT);
    });

    describe('STRAATBEELD_SET_ORIENTATION', function () {
        it('updates the camera orientation', function () {
            var inputState = angular.copy(inputStateWithStraatbeeld),
                payload = {
                    heading: 91,
                    pitch: 0.6,
                    fov: 76
                },
                output;

            output = straatbeeldReducers.STRAATBEELD_SET_ORIENTATION(inputState, payload);
            expect(output.straatbeeld.camera).toEqual(payload);
        });
    });
});
 