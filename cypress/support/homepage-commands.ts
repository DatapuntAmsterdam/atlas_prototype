import { HOMEPAGE } from './selectors'

declare global {
  // eslint-disable-next-line no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      checkMenuLink({
        menuSelector,
        menu,
        testId,
        href,
      }: {
        menuSelector: string
        menu: string
        testId: string
        href: string
      }): void
      checkNavigationBlock(navigationBlock: string, link: string): void
      checkTheme(theme: string | number | RegExp, link: string): void
    }
  }
}

/**
 * Makes sure that a specific menu section is present and opens it so that its
 * child elements can be accessed
 */
Cypress.Commands.add('checkMenuLink', ({ menuSelector, menu, testId, href }) => {
  if (menuSelector === HOMEPAGE.menuMobile) {
    cy.get(menuSelector).click().contains(menu).click()
  } else {
    cy.get(menuSelector).contains(menu).trigger('mouseover')
  }

  cy.get(menuSelector).find(`[data-testid="${testId}"]`).click()

  cy.url().should('include', href)

  cy.go('back')
})

Cypress.Commands.add('checkNavigationBlock', (navigationBlock: string, link: string) => {
  cy.get(navigationBlock).scrollIntoView().should('be.visible').click()
  cy.url().should('include', link)
  cy.go('back')
})

Cypress.Commands.add('checkTheme', (theme: string, link: string) => {
  cy.get(HOMEPAGE.themeLink).contains(theme).should('be.visible').click()
  cy.url().should('include', link)
  cy.go('back')
})
