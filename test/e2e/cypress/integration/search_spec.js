import { DATA_SEARCH, MAP, SEARCH } from '../support/selectors'

describe('search module', () => {
  beforeEach(() => {
    cy.server()
    cy.route(`typeahead/?q=dam`).as('typeaheadResults')
    cy.route('/bag/v1.1./openbareruimte/*').as('getDetail')
    cy.route('/jsonapi/node/list/**').as('jsonapi')
    cy.route('POST', '/cms_search/graphql/').as('graphql')
    cy.defineSearchRoutes()

    cy.hidePopup()

    cy.visit('/')
    cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
    cy.get(DATA_SEARCH.autoSuggest).type('dam')
    cy.wait('@jsonapi')
  })

  describe('autosuggest', () => {
    beforeEach(() => {
      cy.wait('@typeaheadResults')
    })

    it('should be able to navigate throught results with arrow keys', () => {
      cy.wait(1000)
      cy.get(DATA_SEARCH.autoSuggestInput).type('{downarrow}{downarrow}{downarrow}{downarrow}', {
        delay: 60,
      })
      cy.get(DATA_SEARCH.autosuggestDropdownItemActive).should('contain', 'Panoramabeelden')
      cy.get(SEARCH.input).should('have.value', 'Panoramabeelden')
      cy.get(DATA_SEARCH.autoSuggestInput).type('{downarrow}')
      cy.get(DATA_SEARCH.autosuggestDropdownItemActive).contains('Cameratoezichtgebieden')
    })

    it('should go to the search result page when selecting the link with more results', () => {
      cy.contains('Meer resultaten in').first().click()

      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.contains("met 'dam' (")
    })

    it('should go to the detail page when selecting a result', () => {
      cy.contains('Bodemkwaliteit').click()
      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.url().should('include', '/data/?modus=kaart&lagen')
      cy.get(MAP.mapContainer).should('be.visible')
    })
  })

  describe('search results pages', () => {
    beforeEach(() => {
      cy.get(DATA_SEARCH.autoSuggest).submit()
      cy.url().should('include', '/zoek/?term=dam')
    })

    it('should contain the proper titles', () => {
      cy.get('h1').should('be.visible').and('contain', "Alle zoekresultaten met 'dam' (")

      cy.get('button').should('be.visible').and('contain', 'Filteren')

      cy.get('h2').should('be.visible').and('contain', 'Kaartlagen')
      cy.get('h2').should('be.visible').and('contain', 'Kaartcollecties')
      cy.get('h2').should('be.visible').and('contain', 'Data')
      cy.get('h2').should('be.visible').and('contain', 'Publicaties')
      cy.get('h2').should('be.visible').and('contain', 'Artikelen')
    })
  })
})
