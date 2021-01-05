/**
 * Checks for the existence of text values in the preview panel.
 *
 * @param {Array.<string>|string} expectedValues The text value(s) that should
 *   exist in the preview panel.
 */
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
