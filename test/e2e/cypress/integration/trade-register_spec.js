import { HOMEPAGE, DATA_SEARCH, DATA_SELECTION_TABLE, TABLES } from '../support/selectors'

describe('trade-register (vestigingen) module', () => {
  describe('user should be able to navigate to the trade-register from the homepage', () => {
    beforeEach(() => {
      cy.server()
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.hidePopup()
      cy.visit('/')
    })
    it('should be able to navigate to the trade register', () => {
      cy.get(HOMEPAGE.navigationBlock).contains('Tabellen').click()
      cy.wait('@jsonapi')
      cy.get('[href*="data/hr/vestigingen/"]').should('be.visible')
    })
  })

  describe('not authenticated', () => {
    beforeEach(() => {
      cy.hidePopup()
      cy.visit('/data/hr/vestigingen/?modus=volledig')
    })

    describe('user should not be able to view the trade register', () => {
      it('should show a notification that the user must authenticate', () => {
        // a warning notification should be shown that the user must authenticate
        cy.contains(
          'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
        ).and('be.visible')
      })

      it('should not show the table with results', () => {
        // the table with results should not exist
        cy.get(DATA_SELECTION_TABLE.table).should('not.exist').and('not.be.visible')
      })
    })
  })

  describe('authenticated', () => {
    before(() => {
      cy.login()
    })

    after(() => {
      cy.logout()
    })

    beforeEach(() => {
      cy.server()
      cy.route('/dataselectie/hr/*').as('getResults')
      cy.hidePopup()
      cy.visit('/data/hr/vestigingen/?modus=volledig')

      cy.wait('@getResults')
    })

    describe('user should be able to view the trade register', () => {
      it('should not show a notification', () => {
        cy.get(DATA_SEARCH.infoNotification).should('not.exist').and('not.be.visible')
      })

      it('should show the table with results', () => {
        cy.get(DATA_SELECTION_TABLE.table).should('exist').and('be.visible')
      })
    })

    describe('user should be able to navigate to the trade register detail view', () => {
      it('should open the correct detail view', () => {
        cy.server()
        cy.route('/handelsregister/vestiging/*').as('getVestiging')

        cy.get(TABLES.vestigingLink).first().click({ force: true })

        cy.wait('@getVestiging')
        cy.get(TABLES.detailPane).should('exist').and('be.visible')
      })
    })
  })
})
