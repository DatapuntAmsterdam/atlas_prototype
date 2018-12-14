(function () {
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
            const followLink = (attributes) => {
                const url = attributes.dpFollowLink;
                const resourceName = attributes.dpFollowLinkResourceName;
                $window._paq.push(['trackEvent', 'Download', resourceName, url]);
                $window.open(url, '_blank');
            };

            elem.on('click', function () {
                followLink(attrs);
            });

            elem.on('keypress', function (event) {
                if (event.key === 'Enter') {
                    followLink(attrs);
                }
            });
        }
    }
})();
