const KB = 1024;
const MB = 1024 * 1024;
const GB = 1024 * 1024 * 1024;
const TB = 1024 * 1024 * 1024 * 1024;

describe('The filesize filter', () => {
    'use strict';

    let filesizeFilter,
        localization;

    beforeEach(() => {
        localization = jasmine.createSpyObj('localizationFactory', ['toLocaleString']);
        angular.mock.module('dpShared', { localization });

        angular.mock.inject($filter => {
            filesizeFilter = $filter('filesize');
        });

        // simulate replacement of numbers from '1.7' to '1,5' as would be done by localization
        localization.toLocaleString.and.callFake(number => number.replace(/\./g, ','));
    });

    it('returns - on invalid input', () => {
        expect(filesizeFilter()).toEqual('-');
        expect(filesizeFilter('foo')).toEqual('-');
    });

    it('indicates all small sizes as < 0,1 MB', () => {
        expect(filesizeFilter(0)).toEqual('< 0,1 MB');
        expect(filesizeFilter(1)).toEqual('< 0,1 MB');
        expect(filesizeFilter(1.0 * KB)).toEqual('< 0,1 MB');
    });

    it('uses MB units to show range between <0.1 MB and 1 MB', () => {
        expect(filesizeFilter(0.1 * MB)).toEqual('0,1 MB');
        expect(filesizeFilter(120 * KB)).toEqual('0,1 MB');
        expect(filesizeFilter(500 * KB - 1)).toEqual('0,5 MB');
    });

    it('shows MB to one decimal precision', () => {
        expect(filesizeFilter(1.0 * MB)).toEqual('1,0 MB');
        expect(filesizeFilter(1.5 * MB)).toEqual('1,5 MB');
        expect(filesizeFilter(120 * MB)).toEqual('120,0 MB');
    });

    it('shows GB to one decimal precision', () => {
        expect(filesizeFilter(1.0 * GB)).toEqual('1,0 GB');
        expect(filesizeFilter(1.1 * GB)).toEqual('1,1 GB');
        expect(filesizeFilter(0.1 * TB)).toEqual('102,4 GB');
    });

    it('shows TB to one decimal precision', () => {
        expect(filesizeFilter(1.0 * TB)).toEqual('1,0 TB');
        expect(filesizeFilter(1.5 * TB)).toEqual('1,5 TB');
    });

    it('does not go higher than TB', () => {
        expect(filesizeFilter(777 * TB)).toEqual('777,0 TB');
        expect(filesizeFilter(7777 * TB)).toEqual('7777,0 TB');
    });
});
