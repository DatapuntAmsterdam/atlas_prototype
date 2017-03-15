(function () {
    'use strict';

    angular
        .module('dpPage')
        .directive('dpGoogleSpreadsheetScript', dpGoogleSpreadsheetScriptDirective);

    dpGoogleSpreadsheetScriptDirective.$inject = ['$window'];

    function dpGoogleSpreadsheetScriptDirective ($window) {
        return {
            restrict: 'E',
            scope: {
                key: '@',
                sheet: '@',
                callback: '&'
            },
            link: dpGoogleSpreadsheetScriptLink
        };

        function dpGoogleSpreadsheetScriptLink (scope, elem) {
            // Create a temporary function in the global scope that can be called by the google script
            let callbackName = 'googleScriptCallback' + scope.$id;
            $window[callbackName] = (news) => scope.$applyAsync(() => scope.callback({news}));

            // Create the script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'https://spreadsheets.google.com/feeds/list/' +
                scope.key +
                '/' +
                scope.sheet +
                '/public/basic?alt=json-in-script&callback=' +
                callbackName;
            document.head.appendChild(script);

            // Remove the original element after it has been replaced by the google script tag
            elem.remove();

            // On destroy remove the script from the document.head and remove the global scope function
            scope.$on('$destroy', () => {
                delete $window[callbackName];
                document.head.removeChild(script);
            });
        }
    }
})();
