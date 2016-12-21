(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('dataFormatter', dataFormatterFactory);

    function dataFormatterFactory () {
        return {
            formatData
        };

        function formatData (data, subject) {
            switch (subject) {
                case 'api':
                    return formatApiData(data);
                default:
                    return data;
            }
        }

        function formatApiData (data) {
            let formattedData = {
                _display: data.result.title
            };
            return [
                'title',
                'author',
                'author_email',
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
    }
})();
