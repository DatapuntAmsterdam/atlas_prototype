(function () {
    'use strict';

    const moduleDependencies = [
        // Main modules
        'dpHeader',
        'dpPage',
        'dpDetail',
        'dpDataSelection',

        // Shared module
        'dpShared',

        // Third party modules
        'angulartics.piwik',

        'ngAria'
    ];

    // eslint-disable-next-line angular/di
    angular.module('atlas', moduleDependencies)
        .config(['$analyticsProvider', '$provide', analyticsProvider]);

    analyticsProvider.$inject = ['$analyticsProvider', '$provide'];
    function analyticsProvider ($analyticsProvider, $provide) {
        $analyticsProvider.virtualPageviews(false);
        $provide.decorator('$browser', ['$delegate', function ($delegate) {
            $delegate.onUrlChange = function () { };
            $delegate.url = function () { return ''; };
            return $delegate;
        }]);
    }
})();
