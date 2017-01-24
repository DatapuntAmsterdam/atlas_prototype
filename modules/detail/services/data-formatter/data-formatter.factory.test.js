describe('The dataFormatter factory', function () {
    'use strict';

    var dataFormatter;

    beforeEach(function () {
        angular.mock.module('dpDetail');

        angular.mock.inject(function (_dataFormatter_) {
            dataFormatter = _dataFormatter_;
        });
    });

    it('formats API data by selecting only a set of required properties', function () {
        var result = dataFormatter.formatData({
            result: {
                title: 'myTitle',
                author: 'myAuthor',
                author_email: 'email',
                metadata_created: 'created',
                metadata_modified: 'modified',
                maintainer: 'maintainer',
                maintainer_email: 'maintainerEmail',
                notes: 'myNotes',
                groups: 'myGroups',
                resources: 'myResources',
                tags: 'myTags',
                license_id: 'license',
                license_title: 'licenseTitle',
                license_url: 'licenseUrl',
                somethingElse: 'aap'

            }
        }, 'api');
        expect(result).toEqual(
            {
                _display: 'myTitle',
                title: 'myTitle',
                author: 'myAuthor',
                author_email: 'email',
                metadata_created: 'created',
                metadata_modified: 'modified',
                maintainer: 'maintainer',
                maintainer_email: 'maintainerEmail',
                notes: 'myNotes',
                groups: 'myGroups',
                resources: 'myResources',
                tags: 'myTags',
                license_id: 'license',
                license_title: 'licenseTitle',
                license_url: 'licenseUrl'
            }
        );
    });

    it('returns the original data for non-API data', function () {
        var result = dataFormatter.formatData('aap');
        expect(result).toBe('aap');
    });
});
