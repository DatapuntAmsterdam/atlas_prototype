describe('The urlReducers factory', function () {
    var urlReducers,
        stateUrlConverter;

    beforeEach(function () {
        angular.mock.module('atlas',
            {
                stateUrlConverter: {
                    params2state: (oldState, payload) => angular.merge({}, oldState, payload)
                }
            }
        );

        angular.mock.inject(function (_urlReducers_, _stateUrlConverter_) {
            urlReducers = _urlReducers_;
            stateUrlConverter = _stateUrlConverter_;
        });
    });

    describe('The URL_CHANGE reducer', function () {
        it('transforms an url into a state', function () {
            var output = urlReducers.URL_CHANGE({some: 'object'}, {someOther: 'object'});
            expect(output).toEqual(stateUrlConverter.params2state({some: 'object'}, {someOther: 'object'}));
        });
    });
});
