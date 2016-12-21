(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('truncateHtmlAsText', truncateHtmlAsText);

    function truncateHtmlAsText () {
        const ELLIPSES = '...',
            MAX_LENGTH = 250,
            TRAILING_WHITESPACE = /\s+$/;

        return function (input, maxLength = MAX_LENGTH) {
            if (angular.isString(input)) {
                // Remove HTML code
                let truncated = input.replace(/<[^>]+>/gm, '');
                // Remove trailing white space
                truncated = truncated.replace(TRAILING_WHITESPACE, '');
                if (truncated.length > maxLength) {
                    // truncate srting but leave space for ellipses
                    truncated = truncated.substr(0, maxLength - ELLIPSES.length);
                    // truncate on last space(s)
                    let lastSpace = truncated.lastIndexOf(' ');
                    if (lastSpace >= 0) {
                        truncated = truncated
                            .substr(0, lastSpace)
                            .replace(TRAILING_WHITESPACE, '');
                    }
                    truncated += ELLIPSES;
                }
                return truncated;
            } else {
                return input;
            }
        };
    }
})();
