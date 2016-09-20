describe('The reducer factory', function () {
    var reducer,
        urlReducers,
        homeReducers,
        detailReducers,
        mapReducers,
        pageReducers,
        searchReducers,
        straatbeeldReducers,
        dataSelectionReducers,
        printReducers,
        stackedPanelsReducers,
        inputState;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            {
                urlReducers: {
                    ACTION_A: function () {}
                },
                detailReducers: {
                    ACTION_B: function () {}
                },
                homeReducers: {
                    ACTION_C: function () {}
                },
                mapReducers: {
                    ACTION_D: function () {}
                },
                pageReducers: {
                    ACTION_E: function () {}
                },
                searchReducers: {
                    ACTION_F: function () {}
                },
                straatbeeldReducers: {
                    ACTION_G: function () {}
                },
                dataSelectionReducers: {
                    ACTION_H: function () {}
                },
                stackedPanelsReducers: {
                    ACTION_I: function () {}
                },
                printReducers: {
                    ACTION_J: function () {}
                }
            }
        );

        angular.mock.inject(function (
            _urlReducers_,
            _detailReducers_,
            _homeReducers_,
            _mapReducers_,
            _pageReducers_,
            _searchReducers_,
            _straatbeeldReducers_,
            _dataSelectionReducers_,
            _stackedPanelsReducers_,
            _printReducers_) {

            urlReducers = _urlReducers_;
            detailReducers = _detailReducers_;
            homeReducers = _homeReducers_;
            mapReducers = _mapReducers_;
            pageReducers = _pageReducers_;
            searchReducers = _searchReducers_;
            straatbeeldReducers = _straatbeeldReducers_;
            dataSelectionReducers = _dataSelectionReducers_;
            stackedPanelsReducers= _stackedPanelsReducers_;
            printReducers = _printReducers_;
        });

        angular.mock.inject(function (_reducer_, _DEFAULT_STATE_) {
            reducer = _reducer_;
            inputState = _DEFAULT_STATE_;
        });
    });

    it('groups all separate reducers and calls the appropriate one depening on the action type', function () {
        spyOn(urlReducers, 'ACTION_A').and.callThrough();
        spyOn(detailReducers, 'ACTION_B').and.callThrough();
        spyOn(homeReducers, 'ACTION_C').and.callThrough();
        spyOn(mapReducers, 'ACTION_D').and.callThrough();
        spyOn(pageReducers, 'ACTION_E').and.callThrough();
        spyOn(searchReducers, 'ACTION_F').and.callThrough();
        spyOn(straatbeeldReducers, 'ACTION_G').and.callThrough();
        spyOn(dataSelectionReducers, 'ACTION_H').and.callThrough();
        spyOn(stackedPanelsReducers, 'ACTION_I').and.callThrough();
        spyOn(printReducers, 'ACTION_J').and.callThrough();

        reducer(inputState, {type: 'ACTION_A'});
        reducer(inputState, {type: 'ACTION_B'});
        reducer(inputState, {type: 'ACTION_C'});
        reducer(inputState, {type: 'ACTION_D'});
        reducer(inputState, {type: 'ACTION_E'});
        reducer(inputState, {type: 'ACTION_F'});
        reducer(inputState, {type: 'ACTION_G'});
        reducer(inputState, {type: 'ACTION_H'});
        reducer(inputState, {type: 'ACTION_I'});
        reducer(inputState, {type: 'ACTION_J'});

        expect(urlReducers.ACTION_A).toHaveBeenCalled();
        expect(detailReducers.ACTION_B).toHaveBeenCalled();
        expect(homeReducers.ACTION_C).toHaveBeenCalled();
        expect(mapReducers.ACTION_D).toHaveBeenCalled();
        expect(pageReducers.ACTION_E).toHaveBeenCalled();
        expect(searchReducers.ACTION_F).toHaveBeenCalled();
        expect(straatbeeldReducers.ACTION_G).toHaveBeenCalled();
        expect(dataSelectionReducers.ACTION_H).toHaveBeenCalled();
        expect(stackedPanelsReducers.ACTION_I).toHaveBeenCalled();
        expect(printReducers.ACTION_J).toHaveBeenCalled();
    });

    it('returns the oldState if the specified action type has no separate reducer', function () {
        //Note redux has some built-in action types that we can safely ignore.
        var output = reducer(inputState, {type: 'ACTION_K'});

        expect(output).toBe(inputState);
    });
});