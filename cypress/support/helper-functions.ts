/**
 * Extracts the number between parentheses from a header title.
 *
 * Format: 'Header (14)'
 * Extracts: 14
 *
 * @param {string} text The header title.
 * @return {number} The number from the header title.
 */
const getCountFromHeader = (text: string): number => {
  const match = /\(([0-9.,]*)\)/.exec(text)
  const countStr = match ? match[1].replace('.', '') : null
  return countStr ? parseInt(countStr, 10) : 0
}

export {
  // eslint-disable-next-line import/prefer-default-export
  getCountFromHeader,
}

Cypress.on('uncaught:exception', () => false)
