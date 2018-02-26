/* Deprecated, DO NOT USE THIS */
(function () {
    'use strict';

    angular
        .module('dpShared')
        .directive('dpAlt', function () {
            return {
                restrict: 'A',
                link: dpAlt
            };
        });

    function dpAlt (scope, element, attrs) {
        ['load', 'error']
            .forEach(e => element.bind(
                e,
                () => element.attr('alt', attrs.dpAlt)
            ));
    }
})();
