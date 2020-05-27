import { HEADER, HEADER_MENU, HOMEPAGE, SEARCH } from '../support/selectors'

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
      cy.get(HEADER.root).should('be.visible')
      cy.get(HEADER_MENU.rootDefault).should('exist')
      cy.get(SEARCH.form).should('be.visible')
      cy.get(SEARCH.input).should('be.visible')

      cy.get(HOMEPAGE.highlightBlock).should('exist').scrollIntoView().and('be.visible')

      cy.get(HOMEPAGE.navigationBlock).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.navigationBlockKaart).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.navigationBlockPanorama).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.navigationBlockPublicaties).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.navigationBlockDatasets).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.navigationBlockTabellen).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.navigationBlockDataservices)
        .should('exist')
        .scrollIntoView()
        .and('be.visible')

      cy.get(HOMEPAGE.specialBlock)
        .contains('Dossiers')
        .should('exist')
        .scrollIntoView()
        .and('be.visible')
      cy.get(HOMEPAGE.specialBlock)
        .contains('Meer data')
        .should('exist')
        .scrollIntoView()
        .and('be.visible')

      cy.get(HOMEPAGE.organizationBlock).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.aboutBlock).should('exist').scrollIntoView().and('be.visible')
    })
  })
})
