import { HEADER, HOMEPAGE, SEARCH } from '../support/selectors'

describe('homepage module', () => {
  beforeEach(() => {
    cy.server()
    cy.route('/jsonapi/node/list/**').as('jsonapi')
    cy.hidePopup()

    cy.visit('/')

    cy.wait('@jsonapi')
  })

  describe('user should be able to navigate to the content from the homepage', () => {
    it('should render all the frontpage elements', () => {
      cy.get(HOMEPAGE.highlightBlock).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.navigationBlock).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.specialBlock).first().should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.specialBlock).last().should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.organizationBlock).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.aboutBlock).should('exist').scrollIntoView().and('be.visible')

      cy.get(HEADER.root).should('be.visible')

      cy.get(SEARCH.form).should('be.visible')
      cy.get(SEARCH.input).should('be.visible')
    })
  })
})
