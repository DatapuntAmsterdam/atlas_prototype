describe('The reducer factory', () => {
    var reducer,
        $window,
        urlReducers,
        homeReducers,
        layerSelectionReducers,
        mapReducers,
        pageReducers,
        searchReducers,
        straatbeeldReducers,
        dataSelectionReducers,
        printReducers,
        embedReducers,
        inputState,
        freeze,
        environment;

    beforeEach(() => {
        angular.mock.module(
            'atlas',
            {
                $window: {
                    reducers: {
                        detailReducer: angular.noop
                    }
                },
                freeze: jasmine.createSpyObj('freeze', ['deepFreeze']),
                environment: jasmine.createSpyObj('environment', ['isDevelopment']),
                urlReducers: {
                    ACTION_A: function () {}
                },
                homeReducers: {
                    ACTION_C: function () {}
                },
                layerSelectionReducers: {
                    ACTION_D: function () {}
                },
                mapReducers: {
                    ACTION_E: function () {}
                },
                pageReducers: {
                    ACTION_F: function () {}
                },
                searchReducers: {
                    ACTION_G: function () {}
                },
                straatbeeldReducers: {
                    ACTION_H: function () {}
                },
                dataSelectionReducers: {
                    ACTION_I: function () {}
                },
                printReducers: {
                    ACTION_J: function () {}
                },
                embedReducers: {
                    ACTION_K: function () {}
                }
            }
        );

        // eslint-disable-next-line max-params
        angular.mock.inject((
            _$window_,
            _urlReducers_,
            _homeReducers_,
            _layerSelectionReducers_,
            _mapReducers_,
            _pageReducers_,
            _searchReducers_,
            _straatbeeldReducers_,
            _dataSelectionReducers_,
            _printReducers_,
            _embedReducers_,
            _freeze_,
            _environment_
        ) => {
            $window = _$window_;
            urlReducers = _urlReducers_;
            homeReducers = _homeReducers_;
            layerSelectionReducers = _layerSelectionReducers_;
            mapReducers = _mapReducers_;
            pageReducers = _pageReducers_;
            searchReducers = _searchReducers_;
            straatbeeldReducers = _straatbeeldReducers_;
            dataSelectionReducers = _dataSelectionReducers_;
            printReducers = _printReducers_;
            embedReducers = _embedReducers_;
            freeze = _freeze_;
            environment = _environment_;
        });

        const DEFAULT_STATE = {
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

        angular.mock.inject(_reducer_ => {
            reducer = _reducer_;
            inputState = DEFAULT_STATE;
        });

        environment.isDevelopment.and.returnValue(false);
    });

    it('groups all separate reducers and calls the appropriate one depening on the action type', () => {
        spyOn(urlReducers, 'ACTION_A').and.callThrough();
        spyOn(homeReducers, 'ACTION_C').and.callThrough();
        spyOn(layerSelectionReducers, 'ACTION_D').and.callThrough();
        spyOn(mapReducers, 'ACTION_E').and.callThrough();
        spyOn(pageReducers, 'ACTION_F').and.callThrough();
        spyOn(searchReducers, 'ACTION_G').and.callThrough();
        spyOn(straatbeeldReducers, 'ACTION_H').and.callThrough();
        spyOn(dataSelectionReducers, 'ACTION_I').and.callThrough();
        spyOn(printReducers, 'ACTION_J').and.callThrough();
        spyOn(embedReducers, 'ACTION_K').and.callThrough();

        reducer(inputState, {type: {id: 'ACTION_A'}});
        reducer(inputState, {type: {id: 'ACTION_B'}});
        reducer(inputState, {type: {id: 'ACTION_C'}});
        reducer(inputState, {type: {id: 'ACTION_D'}});
        reducer(inputState, {type: {id: 'ACTION_E'}});
        reducer(inputState, {type: {id: 'ACTION_F'}});
        reducer(inputState, {type: {id: 'ACTION_G'}});
        reducer(inputState, {type: {id: 'ACTION_H'}});
        reducer(inputState, {type: {id: 'ACTION_I'}});
        reducer(inputState, {type: {id: 'ACTION_J'}});
        reducer(inputState, {type: {id: 'ACTION_K'}});

        expect(urlReducers.ACTION_A).toHaveBeenCalled();
        expect(homeReducers.ACTION_C).toHaveBeenCalled();
        expect(layerSelectionReducers.ACTION_D).toHaveBeenCalled();
        expect(mapReducers.ACTION_E).toHaveBeenCalled();
        expect(pageReducers.ACTION_F).toHaveBeenCalled();
        expect(searchReducers.ACTION_G).toHaveBeenCalled();
        expect(straatbeeldReducers.ACTION_H).toHaveBeenCalled();
        expect(dataSelectionReducers.ACTION_I).toHaveBeenCalled();
        expect(printReducers.ACTION_J).toHaveBeenCalled();
        expect(embedReducers.ACTION_K).toHaveBeenCalled();
    });

    it('returns the oldState if the specified action type has no separate reducer', () => {
        // Note redux has some built-in action types that we can safely ignore.
        var output = reducer(inputState, {type: {id: 'ACTION_NO_REDUCER'}});

        expect(output).toBe(inputState);
    });

    it('deep freezes the state in development', () => {
        const state = { foo: 'bar' };
        spyOn(urlReducers, 'ACTION_A').and.returnValue(state);
        environment.isDevelopment.and.returnValue(true);

        reducer(inputState, {type: {id: 'ACTION_A'}});

        expect(freeze.deepFreeze).toHaveBeenCalledWith(state);
    });

    it('should map vanilla reducers for cross-compatibility', () => {
        const payload = { foo: 'bar' };
        spyOn($window.reducers, 'detailReducer');
        environment.isDevelopment.and.returnValue(true);

        reducer(inputState, {
            payload,
            type: {
                id: 'FETCH_DETAIL'
            }
        });

        expect($window.reducers.detailReducer.calls.mostRecent().args[1])
            .toEqual(jasmine.objectContaining({ payload, type: 'FETCH_DETAIL' }));
    });
});
