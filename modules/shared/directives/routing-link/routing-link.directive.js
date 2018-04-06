(function () {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpRoutingLink', DpRoutingLinkDirective);

    DpRoutingLinkDirective.$inject = ['$window'];

    function DpRoutingLinkDirective ($window) {
        return {
            restrict: 'A',
            scope: {},
            link: linkFunction
        };

        function linkFunction (scope, elem, attrs) {
            elem.on('click', function () {
                const url = attrs.dpRoutingLink;
                $window.location = url;
            });
        }
    }
})();
