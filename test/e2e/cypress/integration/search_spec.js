import { DATA_SEARCH, MAP, SEARCH } from '../support/selectors'

describe('search module', () => {
  beforeEach(() => {
    cy.server()
    cy.route(`typeahead?q=dam`).as('typeaheadResults')
    cy.route('/bag/v1.1./openbareruimte/*').as('getDetail')
    cy.route('/jsonapi/node/list/**').as('jsonapi')
    cy.route('POST', '/cms_search/graphql/').as('graphql')
    cy.defineSearchRoutes()

    cy.hidePopup()

    cy.visit('/')
    cy.get(DATA_SEARCH.autoSuggest).type('dam')
    cy.wait('@jsonapi')
  })

  describe('autosuggest', () => {
    beforeEach(() => {
      cy.wait('@typeaheadResults')
    })

    it('should be able to navigate throught results with arrow keys', () => {
      // Without wait, the test failt because it is too fast.
      cy.wait(500)
      cy.get(DATA_SEARCH.autoSuggestInput).type('{downarrow}')
      cy.get(DATA_SEARCH.autoSuggestDropdownCategories)
        .eq(0)
        .should('contain', 'Normaal Amsterdams Peil (NAP)')
      cy.get(SEARCH.input).should('have.value', 'Normaal Amsterdams Peil (NAP)')

      cy.get(DATA_SEARCH.autosuggestDropdownActive).contains('Normaal Amsterdams Peil (NAP)')
      cy.get(DATA_SEARCH.autoSuggestInput).type('{downarrow}')
      cy.get(DATA_SEARCH.autosuggestDropdownInActive).contains('Normaal Amsterdams Peil (NAP)')
      cy.get(DATA_SEARCH.autosuggestDropdownActive).contains('Cameratoezichtgebieden')
    })

    it('should go to the search result page when selecting the "..." option', () => {
      cy.contains('...').click()

      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.contains("Alle zoekresultaten met 'dam' (")
    })

    it('should go to the detail page when selecting a result', () => {
      cy.get(DATA_SEARCH.autoSuggestDropdownCategories).eq(0).click()
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
