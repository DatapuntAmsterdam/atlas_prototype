/**
 * Generates a string of 16 random Ascii characters using the native
 * `crypto` library and `btoa`.
 *
 * For IE11 it uses the prefixed `msCrypto` library. In case no crypto
 * library exists in the current environment an empty string will be
 * returned.
 *
 * @returns {string} 16 random Ascii characters, empty in case the
 * `crypto` library is not available.
 */
export default function stateTokenGenerator() {
  // Backwards compatible with msCrypto in IE11
  const cryptoLib = window.crypto || window.msCrypto // eslint-disable-line no-undef

  if (!cryptoLib) {
    return ''
  }

  // Create an array of 16 8-bit unsigned integers
  const list = new Uint8Array(16)
  // Populate the array with random values
  cryptoLib.getRandomValues(list)

  // Binary to Ascii (btoa) converts our (character representation
  // of) our binary data to an Ascii string
  return btoa(
    Array.from(list) // convert to normal array
      .map((n) => String.fromCharCode(n)) // convert each integer to a character
      .join(''),
  ) // convert to a string of characters
}
