(function () {
    'use strict';

    angular
        .module('dpShared')
        .filter('dpBaseEncoder', dpBaseEncoder)
        .filter('dpBaseDecoder', dpBaseDecoder);

    class BaseCoder {
        constructor (base) {
            this.CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

            if (this.isInt(base) && 2 <= base && base <= this.CHARSET.length) {
                this._base = base;
            } else {
                throw `BaseCoder: base ${base} not within 2 and ${this.CHARSET.length}`;
            }
        }

        isInt (n) {
            return angular.isNumber(n) && n % 1 === 0;
        }

        characterValue (c) {
            let i = this.CHARSET.indexOf(c);
            if (0 <= i && i < this._base) {
                return i;
            } else {
                throw `BaseCoder: illegal character ${c} for base ${this._base}`;
            }
        }

        precisionFactor (p) {
            if (this.isInt(p) && p !== 0) {
                if (p > 0) {
                    return Math.pow(10, p - 1);
                } else {
                    throw `BaseCoder: negative precision ${p} not allowed`;
                }
            } else {
                throw `BaseCoder: non integer precision ${p} not allowed`;
            }
        }

        encode (expr, precision = 0) {
            if (angular.isNumber(expr)) {
                if (precision !== 0) {
                    expr = Math.round(expr * this.precisionFactor(precision));
                }
                let sign = expr >= 0 ? '' : '-';
                expr = Math.abs(expr);
                if (expr >= this._base) {
                    let quotient = Math.trunc(expr / this._base);
                    let remainder = expr % this._base;
                    return sign + this.encode(quotient) + this.CHARSET[remainder];
                } else {
                    return sign + this.CHARSET[expr];
                }
            } else if (angular.isArray(expr)) {
                return expr.map(e => this.encode(e, precision));
            }
        }

        decode (expr, precision = 0) {
            if (angular.isString(expr)) {
                let sign = 1;
                let result;
                if (expr.charAt(0) === '-') {
                    sign = -1;
                    expr = expr.substr(1);
                }
                let exprLength = expr.length;
                if (exprLength > 1) {
                    let quotient = expr.substr(0, exprLength - 1);
                    let remainder = expr.charAt(exprLength - 1);
                    result = sign * (this._base * this.decode(quotient) + this.characterValue(remainder));
                } else {
                    result = sign * this.characterValue(expr);
                }
                if (precision !== 0) {
                    result = Number((result / this.precisionFactor(precision)).toPrecision(precision));
                }
                return result;
            } else if (angular.isArray(expr)) {
                return expr.map(e => this.decode(e, precision));
            }
        }
    }

    function dpBaseEncoder () {
        return function (input, base, precision = 0) {
            try {
                let coder = new BaseCoder(base);
                return coder.encode(input, precision);
            } catch (e) {
                return;
            }
        };
    }

    function dpBaseDecoder () {
        return function (input, base, precision = 0) {
            try {
                let coder = new BaseCoder(base);
                return coder.decode(input, precision);
            } catch (e) {
                return;
            }
        };
    }
})();
