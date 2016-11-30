(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpBaseCoder', dpBaseCoder);

    class BaseCoder {
        /**
         * Constructor for the BaseCoder class
         * @param base the base to encode and decode numbers, or arrays of numbers to strings or arrays of strings
         */
        constructor (base) {
            /**
             * The charset specifies the mapping from decimal numbers to a certain base
             * Example: F is the 15th character, it represents 15 in the hexadecimal base
             * @type {string[]}
             * @private
             */
            this._CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

            if (BaseCoder.isInt(base) && 2 <= base && base <= this._CHARSET.length) {
                this._base = base;
            } else {
                throw new RangeError(`Base ${base} not within 2 and ${this._CHARSET.length}`);
            }

            /**
             * Gets the decimal value of a character
             * @param {string} c the character for which to get the decimal value
             * @returns {number} the decimal value of the character
             * @private
             */
            this._characterValue = function (c) {
                let i = this._CHARSET.indexOf(c);
                if (0 <= i && i < this._base) {
                    return i;
                } else {
                    throw new TypeError(`Illegal character ${c} for base ${this._base}`);
                }
            };

            /**
             * Encodes a number to the base as set in _base.
             * It does so by recursively calling itself until arriving at a remainder < _base
             * @param {number} n the number to convert
             * @returns {string} the string that represents the number in base _base
             * @private
             */
            this._encodeNumber = function (n) {
                if (n >= this._base) {
                    let quotient = Math.trunc(n / this._base);
                    let remainder = n % this._base;
                    return this._encodeNumber(quotient) +
                        this._encodeNumber(remainder);
                } else {
                    return this._CHARSET[n];
                }
            };

            /**
             * Decodes a string representation of a _base encoded number
             * @param {string} s the string to decode
             * @param {number} len the length of the string to decode
             * @returns {number} the decimal value of the _base decoded string
             * @private
             */
            this._decodeString = function (s, len = s.length) {
                if (len > 1) {
                    let quotient = s.substr(0, len - 1);
                    let remainder = s.charAt(len - 1);
                    return this._base *
                        this._decodeString(quotient, len - 1) +
                        this._decodeString(remainder, 1);
                } else {
                    return this._characterValue(s);
                }
            };
        }

        /**
         * Tells whether a number is an integer
         * @param {number} n the number to test
         * @returns {boolean} true when it concens a number which is an integer
         */
        static isInt (n) {
            return angular.isNumber(n) && n % 1 === 0;
        }

        /**
         * The decimal factor that corresponds to the number of decimals
         * Example 1 decimal corresponds to 0.1
         * @param {number} nDecimals
         * @returns {number}
         */
        static precisionFactor (nDecimals) {
            if (BaseCoder.isInt(nDecimals) && nDecimals !== 0) {
                if (nDecimals > 0) {
                    return Math.pow(10, nDecimals);
                } else {
                    throw new RangeError(`Negative decimals ${nDecimals} not allowed`);
                }
            } else {
                throw new RangeError(`Non integer decimals ${nDecimals} not allowed`);
            }
        }

        /**
         * Reduces the number of decimals by the given precision factor
         * @param {number} n
         * @param {number} precisionFactor
         * @returns {number}
         */
        static toPrecision (n, decimals) {
            return Number(Math.round(n + `e${decimals}`) + `e-${decimals}`);
        }

        /**
         * Encodes a string expression of a number by converting it to a number
         * @param {string} expr the string expression to convert
         * @param {number} nDecimals
         * @returns {string}
         */
        encodeFromString (expr, nDecimals = 0) {
            return this.encode(Number(expr), nDecimals);
        }

        /**
         * Encodes a number or an array of numbers (to any depth) to base _base
         * It does so by calling the private method _encodeNumber
         * @param {(number|number[])}expr the expression (number or array)
         * @param {number} nDecimals
         * @returns {(string|string[])}
         */
        encode (expr, nDecimals = 0) {
            if (angular.isNumber(expr)) {
                if (nDecimals === 0 && !BaseCoder.isInt(expr)) {
                    return undefined;
                } else if (nDecimals !== 0) {
                    let precisionFactor = BaseCoder.precisionFactor(nDecimals);
                    if (isFinite(precisionFactor)) {
                        expr = BaseCoder.toPrecision(expr, nDecimals);
                        expr = Math.round(expr * precisionFactor);
                    } else {
                        return Number.NaN;
                    }
                }
                let sign = '';
                if (expr < 0) {
                    sign = '-';
                    expr = -expr;
                }
                return sign + this._encodeNumber(expr);
            } else if (angular.isArray(expr)) {
                return expr.map(e => this.encode(e, nDecimals));
            }
        }

        /**
         * Decodes an string or an array of strings (to any depth) to decimals
         * It does so by callling decodeString
         * @param {(string|string[])} expr the expression (string or array of strings)
         * @param {number} nDecimals
         * @returns {number}
         */
        decode (expr, nDecimals = 0) {
            if (angular.isString(expr)) {
                let sign = 1;
                if (expr.charAt(0) === '-') {
                    sign = -1;
                    expr = expr.substr(1);
                }
                let result = sign * this._decodeString(expr);
                if (nDecimals !== 0) {
                    let precisionFactor = BaseCoder.precisionFactor(nDecimals);
                    if (isFinite(precisionFactor)) {
                        result = result / BaseCoder.precisionFactor(nDecimals);
                    } else {
                        result = Number.NaN;
                    }
                }
                return result;
            } else if (angular.isArray(expr)) {
                return expr.map(e => this.decode(e, nDecimals));
            }
        }
    }

    /**
     * The dpBaseCode factory
     * Returns only one method; getCoderforBase, that returns a baseCoder instance for the specified base
     * @returns {{getCoderForBase: function(number): BaseCoder}}}
     */
    function dpBaseCoder () {
        return {
            getCoderForBase
        };

        /**
         * Returns an instance of the BaseCode class for the specified base.
         * @param {number} base
         * @returns {BaseCoder}
         */
        function getCoderForBase (base) {
            return new BaseCoder(base);
        }
    }
})();
