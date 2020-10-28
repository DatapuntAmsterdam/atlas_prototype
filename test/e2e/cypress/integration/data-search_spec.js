import { DATA_DETAIL, DATA_SEARCH, MAP, SEARCH } from '../support/selectors'

describe('Search data', () => {
  describe('Autosuggest', () => {
    beforeEach(() => {
      cy.server()
      cy.route('/typeahead?q=dam').as('getResults')
      cy.route('/bag/v1.1/openbareruimte/*').as('getOpenbareRuimte')
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.hidePopup()
      cy.visit('/')
      cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
      cy.get(DATA_SEARCH.autoSuggest).type('dam')
      cy.wait('@jsonapi')
      cy.wait('@getResults')
    })
    it('Should see suggestions in autosuggest and opens openbare ruimte panel', () => {
      cy.get(DATA_SEARCH.autoSuggest).should('exist').and('be.visible')
      cy.get(DATA_SEARCH.autoSuggestHeader)
        .contains('Straatnamen')
        .siblings('ul')
        .children('li')
        .first()
        .children()
        .first()
        .then(($el) => {
          const firstValue = $el[0].innerText
          cy.get('h4').contains('Straatnamen').siblings('ul').children('li').first().click()
          cy.wait('@getOpenbareRuimte')
          cy.wait('@graphql')
          cy.wait('@jsonapi')

          cy.get(DATA_DETAIL.heading).contains(firstValue).should('exist').and('be.visible')
        })
    })
    it('Should be able to navigate through the autosuggest results with arrow keys', () => {
      cy.wait(1000)
      cy.get(DATA_SEARCH.autoSuggestInput).type('{downarrow}{downarrow}{downarrow}{downarrow}', {
        delay: 60,
      })
      cy.get(DATA_SEARCH.autosuggestDropdownItemActive).should('contain', 'Panoramabeelden')
      cy.get(SEARCH.input).should('have.value', 'Panoramabeelden')
      cy.get(DATA_SEARCH.autoSuggestInput).type('{downarrow}')
      cy.get(DATA_SEARCH.autosuggestDropdownItemActive).contains('Cameratoezichtgebieden')
    })

    it('Should go to the search result page when selecting the link with more results', () => {
      cy.contains('Meer resultaten in').first().click()

      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.contains("met 'dam' (")
    })

    it('Should go to the detail page when selecting a result', () => {
      cy.contains('Bodemkwaliteit').click()
      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.url().should('include', '/data/?modus=kaart&lagen')
      cy.get(MAP.mapContainer).should('be.visible')
    })
  })
  describe('User should be able to search', () => {
    beforeEach(() => {
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route('/jsonapi/node/list/*').as('jsonapi')
      cy.hidePopup()

      cy.visit('/')
      cy.get(SEARCH.input).trigger('focus')
    })

    it('Should submit the search and give results', () => {
      cy.get(SEARCH.input).type('Park')
      cy.get(SEARCH.form).submit()

      cy.wait(['@graphql', '@graphql'])
      cy.wait('@jsonapi')

      cy.contains("Alle zoekresultaten met 'Park' (")
    })

    it('Should submit the search and give no results', () => {
      cy.get(SEARCH.input).type('NORESULTS')
      cy.get(DATA_SEARCH.autoSuggest).submit()
      cy.wait(['@graphql', '@graphql'])
      cy.wait('@jsonapi')

      cy.contains("Er zijn geen resultaten gevonden met 'NORESULTS'.").should('be.visible')
      cy.contains('Maak de zoekcriteria eventueel minder specifiek.').should('be.visible')
    })
  })
  describe('Filter on search results', () => {
    beforeEach(() => {
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route('/jsonapi/node/list/*').as('jsonapi')
      cy.hidePopup()

      cy.visit('/')
      cy.get(SEARCH.input).trigger('focus')
    })

    it('Should show all results', () => {
      cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
      cy.get(SEARCH.input).type('Amsterdam')
      cy.get(SEARCH.form).submit()

      cy.wait(['@graphql', '@graphql'])
      cy.wait('@jsonapi')

      cy.contains("Alle zoekresultaten met 'Amsterdam' (")
      cy.get('button').should('be.visible').and('contain', 'Filteren')
      cy.get(DATA_SEARCH.searchResultsCategory).eq(0).should('contain', 'Dossiers (')
      cy.get(DATA_SEARCH.searchResultsCategory).eq(1).should('contain', 'Specials (')
      cy.get(DATA_SEARCH.searchResultsCategory).eq(2).should('contain', 'Kaartlagen (')
      cy.get(DATA_SEARCH.searchResultsCategory).eq(3).should('contain', 'Kaartcollecties (')
      cy.get(DATA_SEARCH.searchResultsCategory).eq(4).should('contain', 'Data (')
      cy.get(DATA_SEARCH.searchResultsCategory).eq(5).should('contain', 'Datasets (')
      cy.get(DATA_SEARCH.searchResultsCategory).eq(6).should('contain', 'Publicaties (')
      cy.get(DATA_SEARCH.searchResultsCategory).eq(7).should('contain', 'Artikelen (')
    })

    it('Should only show dossiers', () => {
      cy.searchWithFilter('Dossiers', 'Amsterdam')
      cy.get(DATA_SEARCH.sortDropdown).should('be.visible')
    })
    it('Should only show specials', () => {
      cy.searchWithFilter('Specials', 'Amsterdam')
      cy.get(DATA_SEARCH.sortDropdown).should('be.visible')
    })
    it('Should only show kaarten', () => {
      cy.searchWithFilter('Kaarten', 'Amsterdam')
    })
    it('Should only show data', () => {
      cy.searchWithFilter('Data', 'Amsterdam')
    })
    it('Should only show datasets', () => {
      cy.searchWithFilter('Datasets', 'Amsterdam')
    })
    it('Should only show publicaties', () => {
      cy.searchWithFilter('Publicaties', 'Amsterdam')
      cy.get(DATA_SEARCH.sortDropdown).should('be.visible')
    })
    it('Should only show artikelen', () => {
      cy.searchWithFilter('Artikelen', 'Amsterdam')
      cy.get(DATA_SEARCH.sortDropdown).should('be.visible')
    })
    it('Should remember the search filter', () => {
      cy.searchWithFilter('Artikelen', 'Amsterdam')
      cy.visit('/')
      cy.get(DATA_SEARCH.autoSuggestInput).focus().type('Amsterdam')
      cy.get(DATA_SEARCH.autoSuggestHeader).should('have.length', 1).and('have.text', 'Artikelen')
    })
  })
})
