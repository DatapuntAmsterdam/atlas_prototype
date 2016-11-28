(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpAbbreviator', dpAbbreviator);

    /**
     * Abbreviator class
     */
    class Abbreviator {
        /**
         * Initializes an instance of the Abbreviator class using the abbreviations as specified by the dictionary
         * The abbreviator is able to abbreviate the string values in any object
         * @param dictionary
         */
        constructor (dictionary = new Map()) {
            this._dictionary = dictionary;

            /**
             * The abbreviation engine that implements the abbreviation and deabbreviation routines
             * @param obj the object for which to abbreviate its string values
             * @param replace the method to replace a string by its abbreviation or vice vera
             * @returns {*} the abbreviated object
             * @private
             */
            this._engine = function (obj, replace) {
                const SEPARATOR = String.fromCharCode(0);   // Prevent conflicts with existing string characters

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
         * @param name
         * @returns {string}
         */
        static variableName (name) {
            const SURROUND_BY_CHAR = '_';
            return `${SURROUND_BY_CHAR}${name.toUpperCase()}${SURROUND_BY_CHAR}`;
        }

        /**
         * Given a string value replace its contents by the corresponding abbreviations
         * Example x = aap will translate "This is an aap" to "This is an _X_"
         * @param value The string to handle
         * @param variableName The name of the variable
         * @param variableValue The value of the variable
         */
        static abbreviateValue (value, variableName, variableValue) {
            return value.replace(
                // Replace variable value by the variable name
                new RegExp(variableValue.replace(/([\.\^\$])/, '\\$1'), 'g'),   // escape meta charactere
                Abbreviator.variableName(variableName));    // variables are uppercase
        }

        /**
         * Given an string with abbreviations, return its orginal value
         * Example x = aap will translate "This is an _X_" to "This is an aap"
         * @param value The string containing abbreviations
         * @param variableName The name of the variable
         * @param variableValue The value of the variable
         */
        static restoreValue (value, variableName, variableValue) {
            return value.replace(
                // Replace variable name by the variable value
                new RegExp(Abbreviator.variableName(variableName), 'g'),
                `${variableValue}`);
        }

        /**
         * Abbreviates the string values of an object
         * @param obj
         * @returns {*}
         */
        abbreviate (obj) {
            return this._engine(obj, Abbreviator.abbreviateValue);
        }

        /**
         * Deabbereviates the string values of an object
         * @param obj
         * @returns {*}
         */
        deabbreviate (obj) {
            return this._engine(obj, Abbreviator.restoreValue);
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
         * @param abbreviations
         * @returns {Abbreviator}
         */
        function getAbbreviatorForAbbreviations (abbreviations) {
            return new Abbreviator(abbreviations);
        }
    }
})();
