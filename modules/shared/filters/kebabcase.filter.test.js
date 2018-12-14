describe('The kebabcase filter', function () {
    'use strict';

    var kebabCaseFilter;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function ($filter) {
            kebabCaseFilter = $filter('kebabcase');
        });
    });

    it('return a string in lower case and with bars instead of spaces/colons', function () {
        expect(kebabCaseFilter('Rest: Atom Feed')).toEqual('rest-atom-feed');
    });

    it('return an empty string when there is no input', function () {
        expect(kebabCaseFilter(null)).toEqual('');
    });
});
