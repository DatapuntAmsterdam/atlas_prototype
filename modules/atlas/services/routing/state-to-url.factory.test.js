describe('The stateToUrl factory', () => {
    var $location,
        stateToUrl,
        stateUrlConverter,
        mockedState;

    beforeEach(() => {
        angular.mock.module('atlas', {
            stateUrlConverter: {
                state2params: state => angular.merge({}, state, {convert: true}),
                state2url: angular.noop
            }
        });

        angular.mock.inject((_$location_, _stateToUrl_, _stateUrlConverter_) => {
            $location = _$location_;
            stateToUrl = _stateToUrl_;
            stateUrlConverter = _stateUrlConverter_;
            mockedState = {
                aap: 'noot',
                mies: 'teun'
            };
        });

        spyOn($location, 'replace');
        spyOn($location, 'search');
        spyOn(stateUrlConverter, 'state2url');
    });

    describe('can update the url to reflect the state', () => {
        it('by calling $location.search', () => {
            stateToUrl.update(mockedState);
            expect($location.search).toHaveBeenCalledWith(stateUrlConverter.state2params(mockedState));
        });

        it('has the option to replace the URL by setting useReplace flag to true', () => {
            // regular call
            stateToUrl.update(mockedState);
            expect($location.replace).not.toHaveBeenCalled();
            expect($location.search).toHaveBeenCalled();

            $location.replace.calls.reset();
            $location.search.calls.reset();

            // call with useReplace flag set
            stateToUrl.update(mockedState, true);
            expect($location.replace).toHaveBeenCalled();
            expect($location.search).toHaveBeenCalled();
        });
    });
});
