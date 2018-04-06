(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('dataFormatter', dataFormatterFactory);

    dataFormatterFactory.$inject = ['store'];

    function dataFormatterFactory (store) {
        return {
            formatData
        };

        function formatData (data, subject) {
            switch (subject) {
                case 'api':
                    return formatApiData(data);
                case 'datasets': // dcat data
                    return formatCatalogData(data);
                default:
                    return data;
            }
        }

        function formatApiData (data) {
            const formattedData = {
                _display: data.result.title
            };
            return [
                'title',
                'publisher',
                'publisher_email',
                'contact_name',
                'contact_email',
                'metadata_created',
                'metadata_modified',
                'notes',
                'resources',
                'tags',
                'license_id',
                'license_title',
                'license_url',
                'groups'
            ].reduce((result, key) => {
                result[key] = data.result[key];
                return result;
            }, formattedData);
        }

        function formatCatalogData (data) {
            const state = store.getState();
            const resourceTypes = state.catalogFilters.resourceTypes;
            if (!resourceTypes) return {};
            var resources = data['dcat:distribution'];

            data.resources = resourceTypes.map((item, index) => {
                return {
                    type: item.id,
                    rows: resources.filter((row) => row['ams:resourceType'] === item.id)
                };
            }).filter(resource => resource.rows.length > 0);

            delete data['dcat:distribution'];
            data.editDatasetUrl = `dcatd_admin/datasets/${data['dct:identifier']}`;
            data.canEditDataset = state.user.scopes.includes('CAT/W');
            // data.canEditDataset = state.user.scopes.includes('GREX/R');

            return data;
        }
    }
})();
