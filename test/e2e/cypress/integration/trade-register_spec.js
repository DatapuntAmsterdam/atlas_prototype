import { DATA_SEARCH, DATA_SELECTION_TABLE, DETAIL_PANEL, HOMEPAGE } from '../support/selectors'

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
        cy.contains(
          'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
        ).and('be.visible')
        cy.get(DATA_SELECTION_TABLE.table).should('not.exist')
      })

      it('should not show vestiginen and maatschappelijke activiteiten in the autosuggest', () => {
        cy.server()
        cy.route('/typeahead?q=bakker*').as('getResults')
        cy.visit('/')

        cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker')

        cy.wait('@getResults')
        cy.get(DATA_SEARCH.autoSuggestTip).should('exist').and('be.visible')
        cy.get(DATA_SEARCH.autoSuggestHeader).should(($values) => {
          expect($values)
            .and.to.not.contain('Vestigingen')
            .and.to.not.contain('Maatschappelijk activiteiten')
        })
      })
      it('should not show "Vestigingen" in the results', () => {
        cy.server()
        cy.route('/typeahead?q=bakker*').as('getResults')
        cy.visit('/')

        cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

        cy.wait('@getResults')
        cy.contains('Vestigingen (').should('not.exist')
        cy.contains('F. Bakkeren').should('not.exist')
      })
    })
  })

  describe('authenticated EMPLOYEE_PLUS', () => {
    before(() => {
      cy.login('EMPLOYEE_PLUS')
    })

    after(() => {
      cy.logout()
    })

    beforeEach(() => {
      cy.server()
      cy.hidePopup()
    })

    it('should open the trade register detail view', () => {
      cy.route('/dataselectie/hr/*').as('getResults')
      cy.route('/handelsregister/vestiging/*').as('getVestiging')
      cy.visit('/data/hr/vestigingen/?modus=volledig')
      cy.wait('@getResults')
      cy.get(DATA_SELECTION_TABLE.table).should('exist').and('be.visible')
      cy.get(DATA_SEARCH.infoNotification).should('not.exist')
      cy.get('tr').eq(1).click()
      cy.wait('@getVestiging')
      cy.get(DETAIL_PANEL.main).should('exist').and('be.visible')
    })
    it('should show "Vestigingen" in the autocomplete', () => {
      cy.route('/typeahead?q=bakker*').as('getResults')
      cy.visit('/')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().click().type('bakker')

      cy.wait('@getResults')
      cy.get(DATA_SEARCH.autoSuggestDropdown).get('h4').invoke('width').should('be.gt', 0)
      cy.get(DATA_SEARCH.autoSuggestTip).should('exist').and('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown).contains('Vestigingen').should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown).contains('F. Bakkeren').should('be.visible')
    })
    it('should show "Vestigingen" in the search results', () => {
      cy.route('/typeahead?q=bakker*').as('getResults')
      cy.visit('/')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

      cy.wait('@getResults')
      cy.contains('Vestigingen (').should('be.visible')
      cy.contains('F. Bakkeren')
    })
  })
  describe('authenticated EMPLOYEE', () => {
    before(() => {
      cy.login('EMPLOYEE')
    })

    after(() => {
      cy.logout()
    })

    beforeEach(() => {
      cy.server()
      cy.hidePopup()
    })
    it('should open the trade register detail view', () => {
      cy.route('/dataselectie/hr/*').as('getResults')
      cy.route('/handelsregister/vestiging/*').as('getVestiging')
      cy.visit('/data/hr/vestigingen/?modus=volledig')
      cy.wait('@getResults')
      cy.get(DATA_SEARCH.infoNotification).should('not.exist')
      cy.get(DATA_SELECTION_TABLE.table).should('exist').and('be.visible')
      cy.get('tr').eq(1).click()
      cy.wait('@getVestiging')
      cy.get(DETAIL_PANEL.main).should('exist').and('be.visible')
    })
    it('should show "Vestigingen" in the autocomplete', () => {
      cy.route('/typeahead?q=bakker*').as('getResults')
      cy.visit('/')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().click().type('bakker')

      cy.wait('@getResults')
      cy.get(DATA_SEARCH.autoSuggestDropdown).get('h4').invoke('width').should('be.gt', 0)
      cy.get(DATA_SEARCH.autoSuggestTip).should('exist').and('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown).contains('Vestigingen').should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown).contains('F. Bakkeren').should('be.visible')
    })
    it('should show "Vestigingen" in the search results', () => {
      cy.route('/typeahead?q=bakker*').as('getResults')
      cy.visit('/')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

      cy.wait('@getResults')
      cy.contains('Vestigingen (').should('be.visible')
      cy.contains('F. Bakkeren')
    })
  })
})
