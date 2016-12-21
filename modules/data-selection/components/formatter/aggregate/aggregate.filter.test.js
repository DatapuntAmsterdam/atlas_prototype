describe('The aggregate filter', function () {
    'use strict';

    var aggregateFilter;

    beforeEach(function () {
        angular.mock.module('dpDataSelection');

        angular.mock.inject(function ($filter) {
            aggregateFilter = $filter('aggregate');
        });
    });

    it('return an array with for every string in the input array an entry with the name and # occurences', function () {
        expect(aggregateFilter(['aap', 'aap'])).toEqual([
            {
                name: 'aap',
                count: 2
            }
        ]);
    });

    it('returns an empty array when supplied with an empty array', function () {
        expect(aggregateFilter([])).toEqual([]);
    });

    it('returns an array sorted on number of occurences and then on name', function () {
        expect(aggregateFilter(['aap', 'aap', 'noot', 'noot', 'mies'])).toEqual([
            {
                name: 'aap',
                count: 2
            }, {
                name: 'noot',
                count: 2
            }, {
                name: 'mies',
                count: 1
            }
        ]);
        expect(aggregateFilter(['aap', 'aap', 'noot', 'noot', 'noot', 'mies'])).toEqual([
            {
                name: 'noot',
                count: 3
            }, {
                name: 'aap',
                count: 2
            }, {
                name: 'mies',
                count: 1
            }
        ]);
        expect(aggregateFilter(['noot', 'noot', 'aap', 'aap', 'mies', 'mies'])).toEqual([
            {
                name: 'aap',
                count: 2
            }, {
                name: 'mies',
                count: 2
            }, {
                name: 'noot',
                count: 2
            }
        ]);
    });
});
