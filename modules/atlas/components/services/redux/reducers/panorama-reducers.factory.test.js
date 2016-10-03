describe('Panorama reducers factory', function () {

    var panoramaReducers,
        inputState,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module('atlas', {
            panoramaConfig: {
                DEFAULT_FOV: 80
            }
        });

        angular.mock.inject(function (_panoramaReducers_, _DEFAULT_STATE_, _ACTIONS_) {
            panoramaReducers = _panoramaReducers_;
            inputState = angular.copy(_DEFAULT_STATE_);
            ACTIONS = _ACTIONS_;
        });

    });


    describe('FETCH_PANORAMA', function () {
        var payload;
        beforeEach(function() {
            payload = {
                'id': 'ABC',
                'heading': 123,
                'isInitial': true
            };
        });
       

        it('when heading is not in payload, use oldstate heading', function() {
            delete payload.heading;

             inputState.panorama = {
                'fov': 1,
                'pitch': 2,
                'date': 'today',
                'heading': 179,
                'hotspots': ['a', 'b'],
                'location': ['lat', 'lon'],
                'image': 'http://example.com/example.png'
            };

            var newState = panoramaReducers[ACTIONS.FETCH_PANORAMA](inputState, payload);
            expect(newState.panorama.heading).toBe(179);
        });
        
        it('when heading is in payload, use the payload heading', function() {
            var newState = panoramaReducers[ACTIONS.FETCH_PANORAMA](inputState, payload);
            expect(newState.panorama.heading).toBe(123);
        });

        it('Set INITIAL id, heading, isInitial', function () {
            inputState.panorama = null;
            var newState = panoramaReducers[ACTIONS.FETCH_PANORAMA](inputState, payload);
            expect(newState.panorama).toEqual(jasmine.objectContaining(payload));
        });

        it('Sets loading indication for map and panorama', function () {
            var newState = panoramaReducers[ACTIONS.FETCH_PANORAMA](inputState, payload);
            expect(newState.panorama.isLoading).toBe(true);
            expect(newState.map.isLoading).toBe(true);
        });

        it('resets previous panorama variables', function () {

            inputState.panorama = {
                'fov': 1,
                'pitch': 2,
                'date': 'today',
                'hotspots': ['a', 'b'],
                'location': ['lat', 'lon'],
                'image': 'http://example.com/example.png'
            };

            var newState = panoramaReducers[ACTIONS.FETCH_PANORAMA](inputState, payload);

            expect(newState.panorama.fov).toBeNull();
            expect(newState.panorama.pitch).toBeNull();
            expect(newState.panorama.date).toBeNull();
            expect(newState.panorama.hotspots).toEqual([]);
            expect(newState.panorama.location).toBeNull();
            expect(newState.panorama.image).toBeNull();
        });

        it('resets detail information', function () {
            inputState.detail = {
                endpoint: 'bag/verblijfsobject/123/',
                geometry: null,
                isLoading: false
            };

            var newState = panoramaReducers[ACTIONS.FETCH_PANORAMA](inputState, payload);
            expect(newState.detail).toBeNull();
        });

        it('resets search results', function () {
            inputState.search = {
                query: 'linnaeus',
            };

            var newState = panoramaReducers[ACTIONS.FETCH_PANORAMA](inputState, payload);
            expect(newState.search).toBeNull();
        });

    });

    describe('SHOW_PANORAMA', function () {
        var payload = {
            date: new Date('2016-05-19T13:04:15.341110Z'),
            hotspots: [{
                id: 'ABC',
                heading: 179,
                distance: 3
            }],
            location: [52, 4],
            image: 'http://example.com/example/bla.png'
        };

        beforeEach(function () {
            inputState.panorama = {
                isLoading: true,
                id: 'ABC',
                heading: 123,
                isInitial: true
            };

            inputState.detail = null;
        });


        it('Adds the payload to the state', function () {
            var newState = panoramaReducers[ACTIONS.SHOW_PANORAMA_INITIAL](inputState, payload);

            expect(newState.panorama).toEqual(jasmine.objectContaining({
                date: new Date('2016-05-19T13:04:15.341110Z'),
                hotspots: [{
                    id: 'ABC',
                    heading: 179,
                    distance: 3
                }],
                location: [52, 4],
                image: 'http://example.com/example/bla.png'
            }));
        });


        it('set defaults for pitch, fov when oldstate is unknown', function () {
            var newState = panoramaReducers[ACTIONS.SHOW_PANORAMA_INITIAL](inputState, payload);
            expect(newState.panorama.pitch).toBe(0);
            expect(newState.panorama.fov).toBe(80);
        });

        it('set Pitch and fov to newState when oldstate is known', function () {
            inputState.panorama.pitch = 1;
            inputState.panorama.fov = 2;

            var newState = panoramaReducers[ACTIONS.SHOW_PANORAMA_INITIAL](inputState, payload);
            expect(newState.panorama.pitch).toBe(1);
            expect(newState.panorama.fov).toBe(2);
        });


        it('do not overwrite isLoading, id, heading, isInitial', function () {
            var newState = panoramaReducers[ACTIONS.SHOW_PANORAMA_INITIAL](inputState, payload);
            expect(newState.panorama).toEqual(jasmine.objectContaining({
                isLoading: false,
                id: 'ABC',
                heading: 123,
                isInitial: true
            }));
        });

        it('Sets loading to false', function () {
            var newState = panoramaReducers[ACTIONS.SHOW_PANORAMA_INITIAL](inputState, payload);
            expect(newState.panorama.isLoading).toBe(false);
            expect(newState.map.isLoading).toBe(false);
        });

        it('sets FOV to DEFAULT_FOV', function () {
            var newState = panoramaReducers[ACTIONS.SHOW_PANORAMA_INITIAL](inputState, payload);
            expect(newState.panorama.fov).toBe(80);
        });


        it('does nothing when panorama is null', function () {
            inputState.panorama = null;
            var newState = panoramaReducers[ACTIONS.SHOW_PANORAMA_INITIAL](inputState, payload);

            expect(newState.panorama).toBeNull();
        });
    });

    describe('setOrientationReducer',function() {
       it('updates the orientation with pitch and fov', function () {
           inputState.panorama = {};

            inputState.panorama.pitch = 1;
            inputState.panorama.fov = 2;
            
            var payload = {
                    heading: 91,
                    pitch: 1,
                    fov: 2
                },
                output;

            output = panoramaReducers.PANORAMA_SET_ORIENTATION(inputState, payload);
            
            expect(output.panorama.pitch).toEqual(payload.pitch);
            expect(output.panorama.fov).toEqual(payload.fov);
        });
    });

});