/**
 * Checks for the existence of text values in the preview panel.
 *
 * @param {Array.<string>|string} expectedValues The text value(s) that should
 *   exist in the preview panel.
 */
export {} // indicate that this is a module

declare global {
  // eslint-disable-next-line no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      checkPreviewPanel(expectedValues: string[] | string): void
    }
  }
}

Cypress.Commands.add('checkPreviewPanel', (expectedValues) => {
  cy.get('.map-preview-panel.map-preview-panel--visible')
    .get('img.map-detail-result__header-pano')
    .should('exist')
    .and('be.visible')
  cy.get('.map-preview-panel.map-preview-panel--visible').should((actualValues) => {
    if (Array.isArray(expectedValues)) {
      expectedValues.forEach((expectedValue) => {
        expect(actualValues).to.contain(expectedValue)
      })
    } else {
      expect(actualValues).to.contain(expectedValues)
    }
  })
})
