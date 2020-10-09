import { ADDRESS_PAGE, DATA_SEARCH, MAP, SEARCH, TABLES } from '../support/selectors'

describe('data search module', () => {
  it('user should see suggestions', () => {
    // open the autocomplete panel and select the first dataset option and route the correct address
    cy.server()
    cy.route('/typeahead/?q=dam').as('getResults')
    cy.route('/bag/v1.1/openbareruimte/*').as('getItem')
    cy.route('POST', '/cms_search/graphql/').as('graphql')
    cy.route('/jsonapi/node/list/*').as('jsonapi')

    cy.hidePopup()
    cy.visit('/')

    cy.get(SEARCH.input).focus().type('Dam')

    cy.wait('@getResults')
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
        cy.wait('@getItem')
        cy.wait('@graphql')
        cy.wait('@jsonapi')

        cy.get(DATA_SEARCH.headerTitle).contains(firstValue).should('exist').and('be.visible')
      })
  })

  it('should open the address detail ', () => {
    cy.server()
    cy.defineGeoSearchRoutes()
    cy.defineAddressDetailRoutes()

    // Use regular expressions in the route to match the spaces
    cy.route('typeahead/?q=ad+windighof+2').as('getResults')

    // ensure the viewport is always the same in this test, so the clicks can be aligned properly
    cy.viewport(1000, 660)
    cy.hidePopup()
    cy.visit('/')
    cy.get(DATA_SEARCH.autoSuggestInput).focus().type('Ad Windighof 2')

    cy.wait('@getResults')
    cy.get(DATA_SEARCH.autoSuggestDropdown).contains('Ad Windighof 2').click({ force: true })

    // check that the large right column is visible and shows the correct data
    cy.wait('@getVerblijfsobject')
    // Rendering after this request takes some time on server
    cy.wait(500)
    cy.get(ADDRESS_PAGE.resultsPanel).should('exist').and('be.visible')
    cy.get(ADDRESS_PAGE.resultsPanel)
      .get(TABLES.detailTitle)
      .contains('Ad Windighof 2')
      .and('have.css', 'font-style')
      .and('match', /normal/)
    cy.get(ADDRESS_PAGE.resultsPanel).get('dl').contains('1087HE')

    cy.wait('@getPanorama')
    cy.get(ADDRESS_PAGE.resultsPanel)
      .get(ADDRESS_PAGE.panoramaThumbnail)
      .should('exist')
      .and('be.visible')

    cy.get(MAP.mapZoomIn).click()
    cy.get(MAP.mapZoomIn).click()
    cy.get(MAP.mapContainer).click(166, 304)

    // check that the address is open in right column
    cy.waitForGeoSearch()
    cy.get(ADDRESS_PAGE.resultsListItem)
      .contains('Ad Windighof 2')
      .should('exist')
      .and('be.visible')
  })
})
describe('user should be able to submit', () => {
  beforeEach(() => {
    cy.server()
    cy.route('POST', '/cms_search/graphql/').as('graphql')
    cy.route('/jsonapi/node/list/*').as('jsonapi')
    cy.hidePopup()

    cy.visit('/')
    cy.get(SEARCH.input).trigger('focus')
  })

  it('should submit the search and give results', () => {
    cy.get(SEARCH.input).type('Park')
    cy.get(SEARCH.form).submit()

    cy.wait(['@graphql', '@graphql'])
    cy.wait('@jsonapi')

    cy.contains("Alle zoekresultaten met 'Park' (")
  })

  it('should submit the search and give no results', () => {
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

  it('should show all results', () => {
    cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
    cy.get(SEARCH.input).type('Amsterdam')
    cy.get(SEARCH.form).submit()

    cy.wait(['@graphql', '@graphql'])
    cy.wait('@jsonapi')

    cy.contains("Alle zoekresultaten met 'Amsterdam' (")
    cy.get(DATA_SEARCH.searchResultsCategory).eq(0).should('contain', 'Dossiers (')
    cy.get(DATA_SEARCH.searchResultsCategory).eq(1).should('contain', 'Specials (')
    cy.get(DATA_SEARCH.searchResultsCategory).eq(2).should('contain', 'Kaartlagen (')
    cy.get(DATA_SEARCH.searchResultsCategory).eq(3).should('contain', 'Kaartcollecties (')
    cy.get(DATA_SEARCH.searchResultsCategory).eq(4).should('contain', 'Data (')
    cy.get(DATA_SEARCH.searchResultsCategory).eq(5).should('contain', 'Datasets (')
    cy.get(DATA_SEARCH.searchResultsCategory).eq(6).should('contain', 'Publicaties (')
    cy.get(DATA_SEARCH.searchResultsCategory).eq(7).should('contain', 'Artikelen (')
  })

  it('should only show dossiers', () => {
    cy.searchWithFilter('Dossiers', 'Amsterdam')
    cy.get(DATA_SEARCH.sortDropdown).should('be.visible')
  })
  it('should only show specials', () => {
    cy.searchWithFilter('Specials', 'Amsterdam')
    cy.get(DATA_SEARCH.sortDropdown).should('be.visible')
  })
  it('should only show kaarten', () => {
    cy.searchWithFilter('Kaarten', 'Amsterdam')
  })
  it('should only show data', () => {
    cy.searchWithFilter('Data', 'Amsterdam')
  })
  it('should only show datasets', () => {
    cy.searchWithFilter('Datasets', 'Amsterdam')
  })
  it('should only show publicaties', () => {
    cy.searchWithFilter('Publicaties', 'Amsterdam')
    cy.get(DATA_SEARCH.sortDropdown).should('be.visible')
  })
  it('should only show artikelen', () => {
    cy.searchWithFilter('Artikelen', 'Amsterdam')
    cy.get(DATA_SEARCH.sortDropdown).should('be.visible')
  })
  it('should remember the search filter', () => {
    cy.searchWithFilter('Artikelen', 'Amsterdam')
    cy.visit('/')
    cy.get(DATA_SEARCH.autoSuggestInput).focus().type('Amsterdam')
    cy.get(DATA_SEARCH.autoSuggestHeader).should('have.length', 1).and('have.text', 'Artikelen')
  })
})
