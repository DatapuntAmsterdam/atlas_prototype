(function () {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionFilterNames', dataSelectionFilterNamesFactory);

    dataSelectionFilterNamesFactory.$inject = ['dataSelectionConfig'];

    function dataSelectionFilterNamesFactory (dataSelectionConfig) {
        return {
            getSlugFor
        };

        function getSlugFor (canonical) {
            const filtered = dataSelectionConfig.bag.FILTERS.filter(filter => filter.canonical === canonical);

            return filtered.length === 1 ? filtered[0].slug : null;
        }
    }
})();
