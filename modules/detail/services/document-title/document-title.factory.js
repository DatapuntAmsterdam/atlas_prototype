(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpDetail')
        .factory('dpDetailDocumentTitle', dpDetailDocumentTitleFactory);

    dpDetailDocumentTitleFactory.$inject = ['endpointParser', 'GLOSSARY'];

    function dpDetailDocumentTitleFactory (endpointParser, GLOSSARY) {
        return {
            getTitle: getTitle
        };

        function getTitle (detailState) {
            const glossaryKey = endpointParser.getGlossaryKey(detailState.endpoint);
            const glossaryDefinition = GLOSSARY.DEFINITIONS[glossaryKey];
            const label = glossaryDefinition ? glossaryDefinition.label_singular : glossaryKey;

            return detailState.display ? `${label}: ${detailState.display}` : label;
        }
    }
})();
