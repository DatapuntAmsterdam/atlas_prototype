Cypress.Commands.add('hidePopup', () => {
  // This will prevent the popup from showing up
  cy.setCookie('showNotificationAlert', '1')
})
