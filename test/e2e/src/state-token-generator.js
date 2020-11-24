/**
 * Generates a string of 16 random Ascii characters using the native
 * `crypto` library and `btoa`.
 *
 * @returns {string} 16 random Ascii characters, empty in case the
 * `crypto` library is not available.
 */
export default function stateTokenGenerator() {
  if (!window.crypto) {
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
