import {
  DETAIL_PANEL,
  DATA_SEARCH,
  DATA_SELECTION_TABLE,
  HOMEPAGE,
  LINKS,
  MAP,
  TABLES,
} from '../support/selectors'

describe('parcel-ownership (eigendommen) module', () => {
  describe('user should be able to navigate to the parcel-ownership from the homepage', () => {
    it('should check if the link to parcel-ownership page is visible', () => {
      cy.hidePopup()
      cy.visit('/')
      cy.get(HOMEPAGE.navigationBlockTabellen).click()
      cy.get('[href*="/data/brk/kadastrale-objecten"]').should('be.visible')
    })
  })

  describe('not authenticated', () => {
    beforeEach(() => {
      cy.hidePopup()
    })

    describe('user should not be able to view the kadaster data', () => {
      it('should show a notification that the user must authenticate', () => {
        cy.visit(LINKS.kadastraleObjecten)
        cy.contains(
          'Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met zakelijk rechthebbenden te bekijken.',
        )
        cy.get(TABLES.tableValue).should('not.exist')
      })

      it('should not show kadastrale subjecten in autosuggest', () => {
        cy.intercept('**/typeahead?q=bakker*').as('getResults')
        cy.visit('/')

        cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker')

        cy.wait('@getResults')
        cy.get(DATA_SEARCH.autoSuggestTip).should('exist').and('be.visible')
        cy.get(DATA_SEARCH.autoSuggestHeader).should('not.contain', 'Kadastrale subjecten')
      })
      it('should not show kadastrale subjecten in results', () => {
        cy.intercept('**/typeahead?q=bakker*').as('getResults')
        cy.visit('/')

        cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

        cy.wait('@getResults')
        cy.contains('Kadastrale subjecten (').should('not.exist')
        cy.contains('Aafje Cornelia Bakker').should('not.exist')
        cy.contains('Bakker & Toledo Holding B.V.').should('not.exist')
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
      cy.hidePopup()
      cy.intercept('**/dataselectie/brk/geolocation/*').as('getDataselectieBrk')
      cy.intercept('**/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.intercept('**/brk/object-expand/*').as('getBrkObjectExpand')
      cy.intercept('**/brk/object/*').as('getBrkObject')
    })

    describe('user should be able to view the eigendommen', () => {
      beforeEach(() => {
        cy.visit(LINKS.kadastraleObjecten)
        cy.wait('@getDataselectieBrk')
      })

      it('should not show a notification', () => {
        cy.get(TABLES.warningPanel).should('not.exist')
      })

      it('should show the table with results', () => {
        cy.get(DATA_SELECTION_TABLE.content).should('exist').and('be.visible')
      })
    })

    describe('user should be able to navigate to the eigendommen detail view', () => {
      it('should open the correct detail view', () => {
        cy.visit(`/data/brk/kadastrale-objecten?center=52.371897%2C4.8933155&filters=%7B"stadsdeel_naam"
        %3A"Centrum"%2C"buurt_naam"%3A"Amstelveldbuurt"%7D&zoom=8`)
        cy.wait('@getDataselectieBrk')

        cy.get(TABLES.tableValue).first().click()

        cy.wait('@getBrkObject')
        cy.wait('@getBrkObjectExpand')
        cy.get(DETAIL_PANEL.main).should('exist').and('be.visible')
      })
    })

    describe('user should be able to add a filter', () => {
      it('should add the filter to the active filters', () => {
        cy.visit('/data/brk/kadastrale-objecten/')
        cy.wait('@getDataselectieBrk')

        cy.contains('Tabel weergeven').click()
        const selectedFilter = 'Afrikahaven'
        cy.get(TABLES.filterItem).find(TABLES.filterLabel).contains(selectedFilter).should('exist')

        cy.get(TABLES.filterItem).find(TABLES.filterLabel).contains(selectedFilter).click()

        cy.get(TABLES.activeFilterItem)
          .find('span')
          .contains(selectedFilter)
          .should('exist')
          .and('be.visible')
      })
    })

    describe('user should be able to view a parcel in the leaflet map', () => {
      it('should open the detail view with a leaflet map and a cursor', () => {
        cy.visit('/data/brk/object/idNL.KAD.OnroerendeZaak.11430433270000?legenda=false&zoom=13')

        cy.wait('@getNummeraanduiding')
        cy.wait('@getBrkObjectExpand')
        cy.wait('@getBrkObject')

        // the cursor should be rendered inside the leaflet map
        cy.get(MAP.mapSelectedObject).should('exist').and('be.visible')
      })
    })
    describe('Autosuggest and search results', () => {
      it('Should show "Kadastrale subjecten" for medewerker plus in the autosuggest', () => {
        cy.intercept('**/typeahead?q=bakker*').as('getResults')
        cy.visit('/')

        cy.get(DATA_SEARCH.autoSuggestInput).focus().click().type('bakker')

        cy.wait('@getResults')
        cy.get(DATA_SEARCH.autoSuggestDropdown).get('h4').invoke('width').should('be.gt', 0)
        cy.get(DATA_SEARCH.autoSuggestTip).should('be.visible')
        cy.get(DATA_SEARCH.autoSuggestDropdown)
          .contains('Kadastrale subjecten')
          .scrollIntoView()
          .should('be.visible')
        cy.get(DATA_SEARCH.autoSuggestDropdown)
          .contains('Aafje Cornelia Bakker')
          .should('be.visible')
        cy.get(DATA_SEARCH.autoSuggestDropdownMoreResults).contains('Kadastrale subjecten').click()
        cy.contains("Data met 'bakker' (").should('be.visible')
        cy.get(DATA_SEARCH.searchResultsCategory)
          .eq(0)
          .should('contain', 'Kadastrale subjecten (')
          .and('be.visible')
      })
      it('Should show "Kadastrale subjecten" and "Maatschappelijke activiteiten in the search results', () => {
        cy.intercept('**/typeahead?q=bakker*').as('getResults')
        cy.visit('/')

        cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

        cy.wait('@getResults')
        cy.contains('Maatschappelijke activiteiten (').should('be.visible')
        cy.contains('Kadastrale subjecten (').should('be.visible')
        cy.contains('Aafje Cornelia Bakker').should('be.visible')
      })
    })
  })
  describe('authenticated EMPLOYEE', () => {
    before(() => {
      cy.login('EMPLOYEE')
    })

    after(() => {
      cy.logout()
    })
    it('Should show "Kadastrale subjecten" for medewerker in the autosuggest', () => {
      cy.intercept('**/typeahead?q=bakker*').as('getResults')
      cy.visit('/')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().click().type('bakker')

      cy.wait('@getResults')
      cy.get(DATA_SEARCH.autoSuggestDropdown).get('h4').invoke('width').should('be.gt', 0)
      cy.get(DATA_SEARCH.autoSuggestTip).should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown)
        .contains('Kadastrale subjecten')
        .scrollIntoView()
        .should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown)
        .contains(' & Toledo Holding B.V.')
        .should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdownMoreResults).contains('Kadastrale subjecten').click()
      cy.contains("Data met 'bakker' (").should('be.visible')
      cy.get(DATA_SEARCH.searchResultsCategory)
        .eq(0)
        .should('contain', 'Kadastrale subjecten (')
        .and('be.visible')
    })
    it('Should show "Kadastrale subjecten" and "Maatschappelijke activiteiten in the search results', () => {
      cy.intercept('**/typeahead?q=bakker*').as('getResults')
      cy.visit('/')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

      cy.wait('@getResults')
      cy.contains('Maatschappelijke activiteiten (').should('be.visible')
      cy.contains('Kadastrale subjecten (').should('be.visible')
      cy.contains('Bakker & Toledo Holding B.V.').should('be.visible')
    })
  })
})
