(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpAbbreviator', dpAbbreviator);

    class Abbreviator {
        static variableName (name) {
            return `_${name.toUpperCase()}_`;
        }

        constructor (dictionary = new Map()) {
            this._dictionary = dictionary;
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

        abbreviate (obj) {
            return this.engine(obj, this.abbreviateValue);
        }

        deabbreviate (obj) {
            return this.engine(obj, this.restoreValue);
        }
    }

    function dpAbbreviator () {
        let abbreviator = new Abbreviator();

        return {
            getAbbreviatorForAbbreviations,
            setAbbreviations,
            abbreviate,
            deabbreviate
        };

        function getAbbreviatorForAbbreviations (abbreviations) {
            return new Abbreviator(abbreviations);
        }

        function setAbbreviations (abbrevs) {
            abbreviator = new Abbreviator(abbrevs);
        }

        function abbreviate (s) {
            return abbreviator.abbreviate(s);
        }

        function deabbreviate (s) {
            return abbreviator.deabbreviate(s);
        }
    }
})();
