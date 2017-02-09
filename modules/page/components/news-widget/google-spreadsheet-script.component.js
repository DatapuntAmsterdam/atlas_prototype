(function () {
    'use strict';

    angular
        .module('dpPage')
        .directive('dpGoogleSpreadsheetScript', dpGoogleSpreadsheetScriptDirective);

    dpGoogleSpreadsheetScriptDirective.$inject = ['$window'];

    function dpGoogleSpreadsheetScriptDirective ($window) {
        return {
            restrict: 'E',
            scope: false,
            link: dpGoogleSpreadsheetScriptLink
        };

        function dpGoogleSpreadsheetScriptLink (scope, elem, attr) {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'http://spreadsheets.google.com/feeds/list/' +
                elem.attr('key') +
                '/' +
                elem.attr('sheet') +
                '/public/basic?alt=json-in-script&callback=' +
                elem.attr('callback');
            document.head.appendChild(script);
            elem.remove();
        }
    }
})();
