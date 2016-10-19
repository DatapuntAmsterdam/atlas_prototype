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

            // Compose a variable name by uppercasing the name
            let variable = name => `_${name.toUpperCase()}_`;

            let abbreviateValue = (value, variableName, variableValue) => value.replace(
                // Replace variable value by the variable name
                new RegExp(variableValue.replace(/([\.\^\$])/, '\\$1'), 'g'),   // escape meta charactere
                variable(variableName));    // variables are uppercase

            let restoreValue = (value, variableName, variableValue) => value.replace(
                // Replace variable name by the variable value
                new RegExp(variable(variableName), 'g'),
                `${variableValue}`);

            // Provide for a compress and uncompress method (mirror methods)
            let [compress, uncompress] = [
                {replace: abbreviateValue},
                {replace: restoreValue}
            ].map(abbreviator => {
                return obj => {
                    dictionary.forEach((variableValue, variableName) => {
                        Object.entries(obj)
                            .map(entry => { return {key: entry[0], value: entry[1]};})
                            .filter(entry => angular.isString(entry.value))  // filter only truthy values
                            .forEach(entry =>
                                obj[entry.key] = abbreviator.replace(entry.value, variableName, variableValue));
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
