describe('The modification-date filter', function () {
    'use strict';

    var modDateFilter;

    beforeEach(function () {
        angular.mock.module('dpDataSelection');

        angular.mock.inject(function ($filter) {
            modDateFilter = $filter('modificationDate');
        });

        var baseTime = new Date('2016-12-15T12:00:00');
        jasmine.clock().mockDate(baseTime);
    });

    it('expects an object with two dates as input', function () {
        expect(modDateFilter()).toBeUndefined();
    });

    it('shows the time as since created when no modified date is supplied', function () {
        expect(modDateFilter({
            metadata_created: '2016-12-10T12:00:00'
        })).toContain('gemaakt');
    });

    it('shows the time as since modified when a modified date is supplied', function () {
        expect(modDateFilter({
            metadata_modified: '2016-12-10T12:00:00'
        })).toContain('gewijzigd');

        expect(modDateFilter({
            metadata_created: '2016-12-10T12:00:00',
            metadata_modified: '2016-12-10T12:00:00'
        })).toContain('gewijzigd');
    });

    it('shows the time difference in milliseconds for very small durations', function () {
        expect(modDateFilter({
            metadata_modified: '2016-12-15T12:00:00'
        })).toBe('0 milliseconden geleden gewijzigd');
    });

    it('shows the time difference in seconds for durations >= 2 seconds', function () {
        expect(modDateFilter({
            metadata_modified: '2016-12-15T11:59:00'
        })).toBe('60 seconden geleden gewijzigd');
    });

    it('shows the time difference in minutes for durations >= 2 minutes', function () {
        expect(modDateFilter({
            metadata_modified: '2016-12-15T11:58:00'
        })).toBe('2 minuten geleden gewijzigd');
    });

    it('shows the time difference in hours for durations >= 2 hours', function () {
        expect(modDateFilter({
            metadata_modified: '2016-12-15T10:00:00'
        })).toBe('2 uren geleden gewijzigd');
    });

    it('shows the time difference in days for durations >= 2 days', function () {
        expect(modDateFilter({
            metadata_modified: '2016-12-13T12:00:00'
        })).toBe('2 dagen geleden gewijzigd');
    });

    it('shows the time difference rounded to the nearest larger value', function () {
        expect(modDateFilter({
            metadata_modified: '2016-12-13T11:59:59'
        })).toBe('3 dagen geleden gewijzigd');
    });

    it('shows the time difference in a compact fashion', function () {
        expect(modDateFilter({
            metadata_modified: '2016-12-13T11:59:59', metadata_compact: true
        })).toBe('3 dagen geleden');
    });
});
