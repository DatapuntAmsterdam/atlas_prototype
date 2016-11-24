(function () {
    'use strict';

    angular
        .module('dpShared')
        .filter('dpAbbreviator', dpAbbreviator)
        .filter('dpDeabbreviator', dpDeabbreviator);

    class Abbreviator {
        constructor (dictionary) {
            this._dictionary = dictionary || new Map();
        }

        engine (obj, replace) {
            this._dictionary.forEach((variableValue, variableName) => {
                Object.entries(obj)
                    .map(entry => { return {key: entry[0], value: entry[1]};})
                    .filter(entry => angular.isString(entry.value))  // filter only truthy values
                    .forEach(entry =>
                        obj[entry.key] = replace(entry.value, variableName, variableValue));
            });
            return obj;
        }

        abbreviate (obj) {
            return this.engine(obj, this.abbreviateValue);
        }

        deabbreviate (obj) {
            return this.engine(obj, this.restoreValue);
        }

        static variableName (name) {
            return `_${name.toUpperCase()}_`;
        }

        abbreviateValue (value, variableName, variableValue) {
            return value.replace(
                // Replace variable value by the variable name
                new RegExp(variableValue.replace(/([\.\^\$])/, '\\$1'), 'g'),   // escape meta charactere
                Abbreviator.variableName(variableName));    // variables are uppercase
        }

        restoreValue (value, variableName, variableValue) {
            return value.replace(
                // Replace variable name by the variable value
                new RegExp(Abbreviator.variableName(variableName), 'g'),
                `${variableValue}`);
        }
    }

    function dpAbbreviator () {
        return function (input, dictionary) {
            try {
                let abbreviator = new Abbreviator(dictionary);
                return abbreviator.abbreviate(input);
            } catch (e) {
                return input;
            }
        };
    }

    function dpDeabbreviator () {
        return function (input, dictionary) {
            try {
                let abbreviator = new Abbreviator(dictionary);
                return abbreviator.deabbreviate(input);
            } catch (e) {
                return input;
            }
        };
    }
})();
