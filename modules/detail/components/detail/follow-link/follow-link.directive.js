((() => {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpFollowLink', DpFollowLinkDirective);

    DpFollowLinkDirective.$inject = ['$window'];

    function DpFollowLinkDirective ($window) {
        return {
            restrict: 'A',
            scope: {},
            link: linkFunction
        };

        function linkFunction (scope, elem, attrs) {
            elem.on ('click', () => {
                const url = attrs.dpFollowLink;
                $window.open(url, '_blank');
            });
        }
    }
}))();
