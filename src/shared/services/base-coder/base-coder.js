/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
export default class BaseCoder {
  /**
   * Constructor for the BaseCoder class
   * @param base the base to encode and decode numbers, or arrays of numbers to strings or
   * arrays of strings
   */
  constructor(base) {
    /**
     * The charset specifies the mapping from decimal numbers to a certain base
     * Example: F is the 15th character, it represents 15 in the hexadecimal base
     * @type {string[]}
     * @private
     */
    this._CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

    if (BaseCoder.isInt(base) && base >= 2 && base <= this._CHARSET.length) {
      this._base = base
    } else {
      throw new RangeError(`Base ${base} not within 2 and ${this._CHARSET.length}`)
    }

    /**
     * Gets the decimal value of a character
     * @param {string} c the character for which to get the decimal value
     * @returns {number} the decimal value of the character
     * @private
     */
    this._characterValue = function (c) {
      const i = this._CHARSET.indexOf(c)
      if (i >= 0 && i < this._base) {
        return i
      }
      throw new TypeError(`Illegal character ${c} for base ${this._base}`)
    }

    /**
     * Encodes a number to the base as set in _base.
     * It does so by recursively calling itself until arriving at a remainder < _base
     * @param {number} n the number to convert
     * @returns {string} the string that represents the number in base _base
     * @private
     */
    this._encodeNumber = function (n) {
      if (n >= this._base) {
        const quotient = Math.trunc(n / this._base)
        const remainder = n % this._base
        return this._encodeNumber(quotient) + this._encodeNumber(remainder)
      }
      return this._CHARSET[n]
    }

    /**
     * Decodes a string representation of a _base encoded number
     * @param {string} s the string to decode
     * @param {number} len the length of the string to decode
     * @returns {number} the decimal value of the _base decoded string
     * @private
     */
    this._decodeString = function (s, len = s.length) {
      if (len > 1) {
        const quotient = s.substr(0, len - 1)
        const remainder = s.charAt(len - 1)
        return (
          this._base * // eslint-disable-line no-mixed-operators
            this._decodeString(quotient, len - 1) + // eslint-disable-line no-mixed-operators
          this._decodeString(remainder, 1)
        )
      }
      return this._characterValue(s)
    }
  }

  /**
   * Tells whether a number is an integer
   * @param {number} n the number to test
   * @returns {boolean} true when it concens a number which is an integer
   */
  static isInt(n) {
    return typeof n === 'number' && n % 1 === 0
  }

  /**
   * The decimal factor that corresponds to the number of decimals
   * Example 1 decimal corresponds to 0.1
   * @param {number} nDecimals
   * @returns {number}
   */
  static precisionFactor(nDecimals) {
    if (BaseCoder.isInt(nDecimals) && nDecimals !== 0) {
      if (nDecimals > 0) {
        // eslint-disable-next-line no-restricted-properties
        return Math.pow(10, nDecimals)
      }
      throw new RangeError(`Negative decimals ${nDecimals} not allowed`)
    } else {
      throw new RangeError(`Non integer decimals ${nDecimals} not allowed`)
    }
  }

  /**
   * Reduces the number of decimals by the given precision factor
   * @param {number|Array} input - it either be a single number of an array of numbers
   * @param {number} decimals
   * @returns {number}
   */
  static toPrecision(input, decimals) {
    if (Array.isArray(input)) {
      return input.map((item) => BaseCoder.toPrecision(item, decimals))
    }
    return Number(`${Math.round(`${input}e${decimals}`)}e-${decimals}`)
  }

  /**
   * Encodes a string expression of a number by converting it to a number
   * @param {string} expr the string expression to convert
   * @param {number} nDecimals
   * @returns {string}
   */
  encodeFromString(expr, nDecimals = 0) {
    return this.encode(Number(expr), nDecimals)
  }

  /**
   * Encodes a number or an array of numbers (to any depth) to base _base
   * It does so by calling the private method _encodeNumber
   * @param {(number|number[])}expression the expression (number or array)
   * @param {number} nDecimals
   * @returns {(string|string[])}
   */
  encode(expression, nDecimals = 0) {
    let expr = expression
    if (typeof expr === 'number') {
      if (nDecimals === 0 && !BaseCoder.isInt(expr)) {
        return undefined
      }
      if (nDecimals !== 0) {
        const precisionFactor = BaseCoder.precisionFactor(nDecimals)
        if (Number.isFinite(precisionFactor)) {
          expr = BaseCoder.toPrecision(expr, nDecimals)
          expr = Math.round(expr * precisionFactor)
        } else {
          return Number.NaN
        }
      }
      let sign = ''
      if (expr < 0) {
        sign = '-'
        expr = -expr
      }
      return sign + this._encodeNumber(expr)
    }
    if (Array.isArray(expr)) {
      return expr.map((e) => this.encode(e, nDecimals))
    }
  }

  /**
   * Decodes an string or an array of strings (to any depth) to decimals
   * It does so by calling decodeString
   * @param {(string|string[])} expression the expression (string or array of strings)
   * @param {number} nDecimals
   * @returns {number}
   */
  decode(expression, nDecimals = 0) {
    let expr = expression
    if (typeof expr === 'string') {
      let sign = 1

      if (expr === '-0') {
        expr = '0'
      }
      if (expr.charAt(0) === '-') {
        sign = -1
        expr = expr.substr(1)
      }
      let result = sign * this._decodeString(expr)
      if (nDecimals !== 0) {
        const precisionFactor = BaseCoder.precisionFactor(nDecimals)
        if (Number.isFinite(precisionFactor)) {
          result /= precisionFactor
        } else {
          result = Number.NaN
        }
      }
      return result
    }
    if (Array.isArray(expr)) {
      return expr.map((e) => this.decode(e, nDecimals))
    }
  }
}
