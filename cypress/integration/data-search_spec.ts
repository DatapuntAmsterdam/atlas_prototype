import { DETAIL_PANEL, DATA_SEARCH, MAP } from '../support/selectors'

describe('Search data', () => {
  describe('Autosuggest', () => {
    beforeEach(() => {
      cy.intercept('**/typeahead?q=dam*').as('getResults')
      cy.intercept('**/bag/v1.1/openbareruimte/**').as('getOpenbareRuimte')
      cy.intercept('**/jsonapi/node/list/**').as('jsonapi')
      cy.intercept('POST', '/cms_search/graphql/').as('graphql')
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

          cy.get(DETAIL_PANEL.heading).contains(firstValue).should('exist').and('be.visible')
        })
    })
    it('Should be able to navigate through the autosuggest results with arrow keys', () => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000)
      cy.get(DATA_SEARCH.autoSuggestInput).type('{downarrow}{downarrow}{downarrow}{downarrow}', {
        delay: 60,
      })
      cy.get(DATA_SEARCH.autosuggestDropdownItemActive).should('contain', 'Panoramabeelden')
      cy.get(DATA_SEARCH.input).should('have.value', 'Panoramabeelden')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500)
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
      cy.intercept('POST', '/cms_search/graphql/').as('graphql')
      cy.intercept('**/jsonapi/node/list/**').as('jsonapi')
      cy.hidePopup()

      cy.visit('/')
      cy.get(DATA_SEARCH.input).trigger('focus')
    })

    it('Should submit the search and give results', () => {
      cy.get(DATA_SEARCH.input).type('Park')
      cy.get(DATA_SEARCH.form).submit()

      cy.wait(['@graphql', '@graphql'])
      cy.wait('@jsonapi')

      cy.contains("Alle zoekresultaten met 'Park' (")
    })

    it('Should submit the search and give no results', () => {
      cy.get(DATA_SEARCH.input).type('NORESULTS')
      cy.get(DATA_SEARCH.autoSuggest).submit()
      cy.wait(['@graphql', '@graphql'])
      cy.wait('@jsonapi')

      cy.contains("Er zijn geen resultaten gevonden met 'NORESULTS'.").should('be.visible')
      cy.contains('Maak de zoekcriteria eventueel minder specifiek.').should('be.visible')
    })
  })
  describe('Filter on search results', () => {
    beforeEach(() => {
      cy.intercept('POST', '/cms_search/graphql/').as('graphql')
      cy.intercept('**/jsonapi/node/list/**').as('jsonapi')
      cy.hidePopup()

      cy.visit('/')
      cy.get(DATA_SEARCH.input).trigger('focus')
    })

    it('Should show all results', () => {
      cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
      cy.get(DATA_SEARCH.input).type('Amsterdam')
      cy.get(DATA_SEARCH.form).submit()

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

  describe('Data search with employee permissions', () => {
    beforeEach(() => {
      cy.hidePopup()
    })

    before(() => {
      cy.login('EMPLOYEE')
    })

    after(() => {
      cy.logout()
    })

    it('Should show an employee all information in a Geo search', () => {
      cy.defineGeoSearchRoutes()
      cy.intercept('**/bag/v1.1/pand/**').as('getPand')
      cy.intercept('**/monumenten/monumenten/?betreft_pand=**').as('getMonumenten')
      cy.intercept('**/bag/v1.1/nummeraanduiding/?pand=**').as('getNummeraanduidingen')
      cy.intercept('**/handelsregister/vestiging/?pand=**').as('getVestigingen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/geozoek?locatie=52.3736166%2C4.8943521')

      cy.waitForGeoSearch()
      cy.wait('@getPand')
      cy.wait('@getMonumenten')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.get(DATA_SEARCH.infoNotification).should('not.exist')
      cy.get('h2').contains('Vestigingen').should('be.visible')
      cy.get(MAP.toggleFullScreen).click()
      cy.waitForGeoSearch()
      cy.get(MAP.mapSearchResultsCategoryHeader)
        .contains('Vestigingen', { timeout: 30000 })
        .should('be.visible')
      cy.contains('Louis Vuitton')
    })
  })
})
