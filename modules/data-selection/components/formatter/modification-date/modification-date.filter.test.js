describe('The modification-date filter', () => {
    'use strict';

    var modDateFilter;

    beforeEach(() => {
        angular.mock.module('dpDataSelection');

        angular.mock.inject($filter => {
            modDateFilter = $filter('modificationDate');
        });

        var baseTime = new Date('2016-12-15T12:00:00');
        jasmine.clock().mockDate(baseTime);
    });

    it('expects an object with two dates as input', () => {
        expect(modDateFilter()).toBeUndefined();
    });

    it('shows the time as since created when no modified date is supplied', () => {
        expect(modDateFilter({
            metadata_created: '2016-12-10T12:00:00'
        })).toContain('gemaakt');
    });

    it('shows the time as since modified when a modified date is supplied', () => {
        expect(modDateFilter({
            metadata_modified: '2016-12-10T12:00:00'
        })).toContain('gewijzigd');

        expect(modDateFilter({
            metadata_created: '2016-12-10T12:00:00',
            metadata_modified: '2016-12-10T12:00:00'
        })).toContain('gewijzigd');
    });

    it('shows the time difference in milliseconds for very small durations', () => {
        expect(modDateFilter({
            metadata_modified: '2016-12-15T12:00:00'
        })).toBe('0 milliseconden geleden gewijzigd');
    });

    it('shows the time difference in seconds for durations >= 2 seconds', () => {
        expect(modDateFilter({
            metadata_modified: '2016-12-15T11:59:00'
        })).toBe('60 seconden geleden gewijzigd');
    });

    it('shows the time difference in minutes for durations >= 2 minutes', () => {
        expect(modDateFilter({
            metadata_modified: '2016-12-15T11:58:00'
        })).toBe('2 minuten geleden gewijzigd');
    });

    it('shows the time difference in hours for durations >= 2 hours', () => {
        expect(modDateFilter({
            metadata_modified: '2016-12-15T10:00:00'
        })).toBe('2 uren geleden gewijzigd');
    });

    it('shows the time difference in days for durations >= 2 days', () => {
        expect(modDateFilter({
            metadata_modified: '2016-12-13T12:00:00'
        })).toBe('2 dagen geleden gewijzigd');
    });

    it('shows the time difference rounded to the nearest larger value', () => {
        expect(modDateFilter({
            metadata_modified: '2016-12-13T11:59:59'
        })).toBe('3 dagen geleden gewijzigd');
    });

    it('shows the time difference in a compact fashion', () => {
        expect(modDateFilter({
            metadata_modified: '2016-12-13T11:59:59', metadata_compact: true
        })).toBe('3 dagen geleden');
    });
});
