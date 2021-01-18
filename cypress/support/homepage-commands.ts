import { DATA_SEARCH, HEADER, HOMEPAGE } from './selectors'

declare global {
  // eslint-disable-next-line no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      checkLogo(size: Cypress.ViewportPreset): void
      checkSearchbar(size: Cypress.ViewportPreset): void
      checkMenuLink(menuSelector: string, menu: string, menuItem: string, link: string): void
      checkNavigationBlock(navigationBlock: string, link: string): void
      checkTheme(theme: string | number | RegExp, link: string): void
    }
  }
}

Cypress.Commands.add('checkLogo', (size: Cypress.ViewportPreset) => {
  cy.log(size)
  if (size === 'macbook-15') {
    cy.get(HEADER.logoAmsterdamTall).should('be.visible')
  } else {
    cy.get(HEADER.logoAmsterdamShort).should('be.visible')
  }
})

Cypress.Commands.add('checkSearchbar', (size: Cypress.ViewportPreset) => {
  cy.log(size)
  if (size.match(/iphone-.*/)) {
    cy.get(HOMEPAGE.buttonSearchMobile).should('be.visible').click()
    cy.get(DATA_SEARCH.input).should('be.visible')
    cy.get(HOMEPAGE.buttonSearchMobileClose).click()
  } else {
    cy.get(DATA_SEARCH.input).should('be.visible')
    cy.get(HOMEPAGE.buttonSearch).should('be.visible')
  }
})

Cypress.Commands.add(
  'checkMenuLink',
  (menuSelector: string, menu: string, menuItem: string, link: string) => {
    if (menuSelector === HOMEPAGE.menuMobile) {
      cy.get(menuSelector).click({ force: true })
    }
    cy.get(menuSelector).contains(menu).click({ force: true })
    cy.get(menuSelector).find(`[title='${menuItem}']`).click({ force: true })
    cy.url().should('include', link)
    cy.go('back')
  },
)

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
