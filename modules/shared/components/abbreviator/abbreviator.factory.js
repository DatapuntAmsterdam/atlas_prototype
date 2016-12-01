(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpAbbreviator', dpAbbreviator);

    const SEPARATOR = String.fromCharCode(0);   // Prevent conflicts with existing string characters
    const SURROUND_BY_CHAR = '_';               // Surrounc variable names by _ character

    class Abbreviator {
        /**
         * Initializes an instance of the Abbreviator class using the abbreviations as specified by the dictionary
         * The abbreviator is able to abbreviate the string values in any object
         * @param {Map} dictionary, defaults to new Map()
         */
        constructor (dictionary = new Map()) {
            this._dictionary = dictionary;

            /**
             * The abbreviation engine that implements the abbreviation and deabbreviation routines
             * @param {Object} obj the object for which to abbreviate its string values
             * @param {function(string, string, string)} replace the method to replace a string by its abbreviation
             * or vice versa
             * @returns {Object} the abbreviated object
             * @private
             */
            this._processAbbreviations = function (obj, replace) {
                let keys = Object
                        .keys(obj)
                        .filter(key => angular.isString(obj[key])),
                    values = keys
                        .map(key => obj[key])
                        .join(SEPARATOR);

                this._dictionary
                    .forEach((variableValue, variableName) => {
                        values = replace(values, variableName, variableValue);
                    });

                values = values
                    .split(SEPARATOR);

                keys
                    .forEach((key, i) => {
                        obj[key] = values[i];
                    });

                return obj;
            };
        }

        /**
         * Given a name return its variable representation
         * Example x returns _X_
         * @param {string} name
         * @returns {string}
         */
        static getVariableNameFor (name) {
            return `${SURROUND_BY_CHAR}${name.toUpperCase()}${SURROUND_BY_CHAR}`;
        }

        /**
         * Given a string value replace its contents by the corresponding abbreviations
         * Example: when x = aap, the string "This is an aap" will be translated to "This is an X"'
         * @param {string} value The string to handle
         * @param {string} variable The name of the variable
         * @param {string} variableValue The value of the variable
         */
        static abbreviateValue (value, variable, variableValue) {
            return value.replace(
                // Replace variable value by the variable name
                new RegExp(variableValue.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'),   // escape meta characters
                Abbreviator.getVariableNameFor(variable));    // variables are uppercase
        }

        /**
         * Given a string with abbreviations, return its orginal value
         * Example: when x = aap, the string "This is an X" will be translated to "This is an aap"'
         * @param {string} value The string containing abbreviations
         * @param {string} variable The name of the variable
         * @param {string} variableValue The value of the variable
         */
        static restoreValue (value, variable, variableValue) {
            return value.replace(
                // Replace variable name by the variable value
                new RegExp(Abbreviator.getVariableNameFor(variable), 'g'),
                variableValue);
        }

        /**
         * Abbreviates the string values of an object
         * @param {Object} obj
         * @returns {Object}
         */
        abbreviate (obj) {
            return this._processAbbreviations(obj, Abbreviator.abbreviateValue);
        }

        /**
         * Deabbereviates the string values of an object
         * @param {Object} obj
         * @returns {Object}
         */
        deabbreviate (obj) {
            return this._processAbbreviations(obj, Abbreviator.restoreValue);
        }
    }

    /**
     * The dpAbbreviator factory
     * @returns {{getAbbreviatorForAbbreviations: getAbbreviatorForAbbreviations}}
     */
    function dpAbbreviator () {
        return {
            getAbbreviatorForAbbreviations
        };

        /**
         * Returns an instance of the Abbreviator class for the specified dictionary
         * @param {Map} abbreviations
         * @returns {Abbreviator}
         */
        function getAbbreviatorForAbbreviations (abbreviations) {
            return new Abbreviator(abbreviations);
        }
    }
})();
