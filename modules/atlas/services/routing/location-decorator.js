(function () {
    'use strict';

    angular
        .module('atlas')
        .config(locationDecorator);

    locationDecorator.$inject = ['$provide'];

    function locationDecorator ($provide) {
        $provide.decorator('$location', urlCompressor);

        urlCompressor.$inject = ['$delegate', 'urlAbbreviations'];

        function urlCompressor ($delegate, urlAbbreviations) {
            let orgSearch = $delegate.search;

            let dictionary = urlAbbreviations.abbreviations;

            // Compose a variable name by placing a _ before and set to uppercase
            let varName = name => `_${name.toUpperCase()}`;

            // Transform any input string to a regular expression, escaping some meta characters
            let toRegExp = s => new RegExp(s.replace(/([\.\^\$])/, '\\$1'), 'g');

            // Provide for a compress and uncompress method (mirror methods)
            let [compress, uncompress] = [
                {io: (val, key) => [toRegExp(key), varName(val)]},  // key maps to short value
                {io: (val, key) => [toRegExp(varName(val)), key]}   // short value maps to key
            ].map(abbreviator => {
                return obj => {
                    dictionary.forEach((val, key) => {
                        let [input, output] = abbreviator.io(val, key);
                        Object.entries(obj)
                            .map(entry => { return {prop: entry[0], value: entry[1]};})
                            .filter(entry => angular.isString(entry.value))  // filter only truthy values
                            .forEach(entry => obj[entry.prop] = entry.value.replace(input, output));
                    });
                    return obj;
                };
            });

            $delegate.search = function mySearch (...a) {
                if (a.length === 0) {
                    return uncompress(orgSearch.apply($delegate, a));
                } else {
                    compress(a[0]);
                    return orgSearch.apply($delegate, a);
                }
            };

            return $delegate;
        }
    }
})();
