(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpBaseCoder', dpBaseCoder);

    class BaseCoder {
        constructor (base) {
            this._CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

            if (BaseCoder.isInt(base) && 2 <= base && base <= this._CHARSET.length) {
                this._base = base;
            } else {
                throw `BaseCoder: base ${base} not within 2 and ${this._CHARSET.length}`;
            }

            this._characterValue = function (c) {
                let i = this._CHARSET.indexOf(c);
                if (0 <= i && i < this._base) {
                    return i;
                } else {
                    throw `BaseCoder: illegal character ${c} for base ${this._base}`;
                }
            };

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

        static isInt (n) {
            return angular.isNumber(n) && n % 1 === 0;
        }

        static precisionFactor (nDecimals) {
            if (BaseCoder.isInt(nDecimals) && nDecimals !== 0) {
                if (nDecimals > 0) {
                    return Math.pow(10, nDecimals);
                } else {
                    throw `BaseCoder: negative decimals ${nDecimals} not allowed`;
                }
            } else {
                throw `BaseCoder: non integer decimals ${nDecimals} not allowed`;
            }
        }

        encodeFromString (expr, nDecimals = 0) {
            return this.encode(Number(expr), nDecimals);
        }

        encode (expr, nDecimals = 0) {
            if (angular.isNumber(expr)) {
                if (nDecimals === 0 && !BaseCoder.isInt(expr)) {
                    return undefined;
                } else if (nDecimals !== 0) {
                    expr = Math.round(expr * BaseCoder.precisionFactor(nDecimals));
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

        decode (expr, nDecimals = 0) {
            if (angular.isString(expr)) {
                let sign = 1;
                if (expr.charAt(0) === '-') {
                    sign = -1;
                    expr = expr.substr(1);
                }
                let result = sign * this._decodeString(expr);
                if (nDecimals !== 0) {
                    result = Number((result / BaseCoder.precisionFactor(nDecimals)).toFixed(nDecimals));
                }
                return result;
            } else if (angular.isArray(expr)) {
                return expr.map(e => this.decode(e, nDecimals));
            }
        }
    }

    function dpBaseCoder () {
        return {
            getCoderForBase
        };

        function getCoderForBase (base) {
            return new BaseCoder(base);
        }
    }
})();
