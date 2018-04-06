describe('The dataFormatter factory', function () {
    'use strict';

    var dataFormatter;
    var mockedState;

    beforeEach(function () {
        mockedState = {
            user: {
                scopes: []
            },
            catalogFilters: {
                resourceTypes: [{
                    id: 'resourceTypeId',
                    label: 'label'
                }]
            }
        };
        angular.mock.module('dpDetail', {
            store: {
                getState: () => {
                    return mockedState;
                }
            }
        });

        angular.mock.inject(function (_dataFormatter_) {
            dataFormatter = _dataFormatter_;
        });
    });

    it('formats API data by selecting only a set of required properties', function () {
        var result = dataFormatter.formatData({
            result: {
                title: 'myTitle',
                publisher: 'publisher',
                publisher_email: 'publisherEmail',
                metadata_created: 'created',
                metadata_modified: 'modified',
                contact_name: 'contactName',
                contact_email: 'contactEmail',
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
        expect(result).toEqual({
            _display: 'myTitle',
            title: 'myTitle',
            publisher: 'publisher',
            publisher_email: 'publisherEmail',
            metadata_created: 'created',
            metadata_modified: 'modified',
            contact_name: 'contactName',
            contact_email: 'contactEmail',
            notes: 'myNotes',
            groups: 'myGroups',
            resources: 'myResources',
            tags: 'myTags',
            license_id: 'license',
            license_title: 'licenseTitle',
            license_url: 'licenseUrl'
        });
    });

    it('returns the original data for non-API data', function () {
        var result = dataFormatter.formatData('aap');
        expect(result).toBe('aap');
    });

    it('uses catalogFiltes to format dcat data', function () {
        const data = {
            'dcat:distribution': [{
                'ams:resourceType': 'resourceTypeId'
            }]
        };
        var result = dataFormatter.formatData(data, 'datasets');
        expect(result).not.toBe(null);
        expect(result['dcat:distribution']).toBe(undefined);
        expect(result.editDatasetUrl).toBeTruthy();
        expect(result.canEditDataset).toBe(false);
    });

    it('returns an empty object when the resourceTypes are not provided to format dcat data', function () {
        mockedState.catalogFilters.resourceTypes = undefined;
        var result = dataFormatter.formatData({}, 'datasets');
        expect(result).toEqual({});
    });
});
