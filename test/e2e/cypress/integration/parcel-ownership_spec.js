import { DATA_SELECTION_TABLE, HOMEPAGE, LINKS, MAP, TABLES } from '../support/selectors'

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
      cy.visit(LINKS.kadastraleObjecten)
    })

    describe('user should not be able to view the kadaster data', () => {
      it('should show a notification that the user must authenticate', () => {
        cy.contains(
          'Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met zakelijk rechthebbenden te bekijken.',
        )
      })

      it('should not show the table with results', () => {
        cy.get(TABLES.tableValue).should('not.be.visible')
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
      cy.hidePopup()
      cy.route('/dataselectie/brk/geolocation/*').as('getDataselectieBrk')
      cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.route('/brk/object-expand/*').as('getBrkObjectExpand')
      cy.route('/brk/object/*').as('getBrkObject')
    })

    describe('user should be able to view the eigendommen', () => {
      beforeEach(() => {
        cy.visit(LINKS.kadastraleObjecten)
        cy.wait('@getDataselectieBrk')
      })

      it('should not show a notification', () => {
        cy.get(TABLES.warningPanel).should('not.exist').and('not.be.visible')
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
        cy.get(TABLES.detailPane).should('exist').and('be.visible')
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
  })
})
