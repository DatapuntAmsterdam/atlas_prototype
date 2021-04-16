/**
 * Converts a number to Dutch decimal notation (e.g. using a comma as decimal separator).
 *
 * E.g.: 3.14159265359 => '3,142'
 *
 * @param {Number} number Input number.
 * @param {Number} precision Number of required decimal places.
 * @returns {string} The Dutch decimal string.
 */
export default function formatNumber(number: number, precision = 3) {
  // TODO: add thousands separator
  const decimals = 10 ** precision
  const rounded = Math.round(number * decimals) / decimals
  return rounded.toString().replace('.', ',')
}
