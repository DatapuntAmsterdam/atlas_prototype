((() => {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpSearchResults')
        .factory('dpSearchResultsDocumentTitle', documentTitleFactory);

    documentTitleFactory.$inject = ['searchTitle'];

    function documentTitleFactory (searchTitle) {
        return {
            getTitle: getTitle
        };

        function getTitle (searchState) {
            if (searchState && !angular.isArray(searchState.location) && !searchState.category) {
                return `Data met '${searchState.query}'`;
            } else {
                const titleData = searchState ? searchTitle.getTitleData(
                        searchState.numberOfResults,
                        searchState.query,
                        searchState.location,
                        searchState.category) : null,
                    baseTitle = (titleData && titleData.title) ? titleData.title : '';

                return (baseTitle && titleData.subTitle) ? `${baseTitle} ${titleData.subTitle}` : baseTitle;
            }
        }
    }
}))();
