((() => {
    'use strict';

    angular
        .module('dpShared')
        .filter('longNameShortener', longNameShortenerFilter);

    longNameShortenerFilter.$inject = ['LONG_NAME_CONFIG'];

    function longNameShortenerFilter (LONG_NAME_CONFIG) {
        return input => {
            var output = angular.copy(input);

            angular.forEach(LONG_NAME_CONFIG, word => {
                angular.forEach(word.input, wordVariation => {
                    output = output.replace(new RegExp(wordVariation, 'i'), word.output);
                });
            });

            return output;
        };
    }
}))();
