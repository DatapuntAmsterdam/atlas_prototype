(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpAbbreviator', dpAbbreviator);

    class Abbreviator {
        constructor (dictionary = new Map()) {
            this._dictionary = dictionary;

            this._engine = function (obj, replace) {
                this._dictionary.forEach((variableValue, variableName) => {
                    Object.entries(obj)
                        .map(entry => { return {key: entry[0], value: entry[1]};})
                        .filter(entry => angular.isString(entry.value))  // filter only truthy values
                        .forEach(entry =>
                            obj[entry.key] = replace(entry.value, variableName, variableValue));
                });
                return obj;
            };
        }

        static variableName (name) {
            const SURROUND_BY_CHAR = '_';
            return `${SURROUND_BY_CHAR}${name.toUpperCase()}${SURROUND_BY_CHAR}`;
        }

        static abbreviateValue (value, variableName, variableValue) {
            return value.replace(
                // Replace variable value by the variable name
                new RegExp(variableValue.replace(/([\.\^\$])/, '\\$1'), 'g'),   // escape meta charactere
                Abbreviator.variableName(variableName));    // variables are uppercase
        }

        static restoreValue (value, variableName, variableValue) {
            return value.replace(
                // Replace variable name by the variable value
                new RegExp(Abbreviator.variableName(variableName), 'g'),
                `${variableValue}`);
        }

        abbreviate (obj) {
            return this._engine(obj, Abbreviator.abbreviateValue);
        }

        deabbreviate (obj) {
            return this._engine(obj, Abbreviator.restoreValue);
        }
    }

    function dpAbbreviator () {
        return {
            getAbbreviatorForAbbreviations
        };

        function getAbbreviatorForAbbreviations (abbreviations) {
            return new Abbreviator(abbreviations);
        }
    }
})();
