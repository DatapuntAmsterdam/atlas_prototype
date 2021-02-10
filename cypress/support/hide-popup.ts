export {} // indicate that this is a module

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      hidePopup(): void
    }
  }
}

Cypress.Commands.add('hidePopup', () => {
  // This will prevent the popup from showing up
  cy.setCookie('showNotificationAlert', '1')
})
