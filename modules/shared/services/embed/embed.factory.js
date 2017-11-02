(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('embed', EmbedFactory);

    EmbedFactory.$inject = ['stateUrlConverter', '$location'];

    function EmbedFactory (stateUrlConverter, $location) {
        const baseUrl = `${$location.protocol()}://${$location.host()}`;

        return {
            getLink: getLink,
            getHtml: getHtml
        };

        function getLink (state) {
            return `${baseUrl}/${stateUrlConverter.state2url(state)}`;
        }

        function getHtml (state) {
            const url = getLink(state);
            return `<iframe width="500" height="400" src="${url}" frameborder="0"></iframe>`;
        }
    }
})();
