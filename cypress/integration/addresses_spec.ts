import { getCountFromHeader } from '../support/helper-functions'
import {
  ADDRESS_PAGE,
  DETAIL_PANEL,
  DATA_SEARCH,
  DATA_SELECTION_TABLE,
  GEO_SEARCH,
  HEADINGS,
  MAP,
  TABLES,
} from '../support/selectors'

describe('addresses module', () => {
  beforeEach(() => {
    cy.intercept('**/dataselectie/bag/**').as('getResults')

    cy.hidePopup()

    cy.visit('/data/bag/adressen/?modus=volledig')
    cy.get(ADDRESS_PAGE.dataSelection).should('be.visible')
    cy.get(TABLES.filterPanel).should('be.visible')
  })

  describe('user should see the addresses table in full mode', () => {
    it('should open the address catalogus', () => {
      cy.get(HEADINGS.dataSelectionHeading).contains('Adressen').should('be.visible')

      cy.get(ADDRESS_PAGE.mapContainer).should('not.exist')
    })
  })

  describe('user should be able to add a filter', () => {
    it('should add the filter to the active filters and filter the results', () => {
      // get the first category
      cy.get(TABLES.filterPanel)
        .find(TABLES.filterCategories)
        .first()
        .then((group) => {
          // get the innerText of the nested h2
          const category = (group[0].children[0] as HTMLElement).innerText
          // get the innerText of the first nested li
          const selectedFilter = (group[0].children[1].children[0] as HTMLElement).innerText
          // click the filter that contains the selectedFilter variable
          cy.get(TABLES.filterItem).find(TABLES.filterLabel).contains(selectedFilter).click()

          cy.wait('@getResults')

          // the filter should be added to the active filters (stadsdeel)
          cy.get(TABLES.activeFilterItem).contains(selectedFilter).and('be.visible')

          // get the position of the category in the th's of the table
          cy.get(`${DATA_SELECTION_TABLE.head} ${DATA_SELECTION_TABLE.cell}`).each(
            (th, index: number) => {
              // if the position is equal to the category
              if (th[0].innerText === category) {
                // get al the content the td's with the same position as the categoryGroup they all
                // should contain the same value as the `selectedFilter`
                cy.get(DATA_SELECTION_TABLE.row)
                  .find(`${DATA_SELECTION_TABLE.cell}:nth-child(${index + 1})`)
                  .contains(selectedFilter)
                  .should('be.visible')
              }
            },
          )
        })
    })
  })

  describe('user should be able to navigate to the address detail view', () => {
    beforeEach(() => {
      cy.defineAddressDetailRoutes()
    })

    it('should open the detail view with the correct address', () => {
      cy.get(`${DATA_SELECTION_TABLE.head} ${DATA_SELECTION_TABLE.cell}`)
        .first()
        .then((firstTableHeader) => {
          const selectedGroup = firstTableHeader[0].innerText.trim()
          cy.get(`${DATA_SELECTION_TABLE.body} ${DATA_SELECTION_TABLE.row}`)
            .first()
            .find(`${DATA_SELECTION_TABLE.cell}:nth-child(1) .qa-table-value`)
            .then((firstValue) => {
              const selectedValue = firstValue[0].innerText.trim()
              // click on the firstItem to open address preview panel
              cy.get(`${DATA_SELECTION_TABLE.body} ${DATA_SELECTION_TABLE.row}`).first().click()

              cy.waitForAdressDetail()

              cy.get(DETAIL_PANEL.main).should('be.visible')

              cy.get('dt')
                .contains(selectedGroup)
                // element can be hidden from view in the detail panel
                .scrollIntoView()
                .and('be.visible')

              cy.get('dt').siblings('dd').first().contains(selectedValue).and('be.visible')
            })
        })
    })

    it('should close the detail view and open the map view with the correct address', () => {
      cy.get(`${DATA_SELECTION_TABLE.head} ${DATA_SELECTION_TABLE.cell}`)
        .first()
        .then(() => {
          cy.get(`${DATA_SELECTION_TABLE.body} ${DATA_SELECTION_TABLE.row}`)
            .first()
            .find(`${DATA_SELECTION_TABLE.cell}:nth-child(1)`)
            .then(() => {
              // click on the firstItem to open address preview panel
              cy.get(`${DATA_SELECTION_TABLE.body} ${DATA_SELECTION_TABLE.row}`).first().click()
              // the detail view should exist
              cy.get(DETAIL_PANEL.main).should('be.visible')
              // click on the maximize button to open the map view
              cy.get(ADDRESS_PAGE.buttonMaximizeMap).should('be.visible').click()

              cy.wait('@getNummeraanduiding')
              cy.wait('@getVerblijfsobject')

              // the preview panel should exist
              cy.get(MAP.mapPreviewPanel).should('be.visible')
            })
        })
    })
  })

  describe('user should be able to view a cursor in the leaflet map', () => {
    it('should open the detail view with a leaflet map and a cursor', () => {
      cy.defineAddressDetailRoutes()

      // click on the first item in the table
      cy.get(`${DATA_SELECTION_TABLE.body} ${DATA_SELECTION_TABLE.row}`).first().click()

      cy.waitForAdressDetail()

      // the cursor should still be rendered inside the leaflet map
      cy.get(ADDRESS_PAGE.iconMapMarker).should('be.visible')
    })
  })

  describe('user should be able to filter on an area', () => {
    it('should show the addresses and map when selected', () => {
      cy.intercept('**/dataselectie/bag/geolocation/**').as('getGeoResults')

      let totalCount: number
      cy.wait('@getResults')

      // Get the number in the title before filtering
      cy.get(HEADINGS.dataSelectionHeading).then((title) => {
        totalCount = getCountFromHeader(title.text())
      })

      // click on "AMC" in the left filter menu
      cy.get(TABLES.filterItem).contains('AMC').click()
      cy.wait('@getResults')

      // Expect the number in the title after filtering to be smaller than the number before
      // filtering
      cy.get(TABLES.filterPanel).should('be.visible')
      cy.get(HEADINGS.dataSelectionHeading).then((title) => {
        const filteredCount = getCountFromHeader(title.text())
        expect(filteredCount).to.be.below(totalCount)
      })

      cy.contains('Kaart weergeven').click()
      cy.wait('@getGeoResults')

      // map should be visible now
      cy.get(ADDRESS_PAGE.mapContainer).should('be.visible')
      // , with large right column
      cy.get(ADDRESS_PAGE.resultsPanel).should('be.visible')
      // count the number of cluster icons on the map
      cy.get(ADDRESS_PAGE.iconCluster).then((items) => {
        expect(items.length).to.gte(1)
      })
      // list should be visible in right column
      cy.get(ADDRESS_PAGE.resultsList).should('be.visible')
      // active filter should show
      cy.get(TABLES.activeFilters).find('button').contains('AMC').should('exist').and('be.visible')
    })
  })
})

describe('user should be able to open more addresses', () => {
  it('should show the addresses', () => {
    cy.intercept('**/typeahead?q=dam+20**').as('getResults')
    cy.intercept('POST', '/cms_search/graphql/').as('graphql')
    cy.intercept('**/jsonapi/node/list/**').as('jsonapi')
    cy.intercept('**/bag/v1.1/pand/**').as('getPand')
    cy.defineGeoSearchRoutes()
    cy.defineAddressDetailRoutes()
    cy.visit('/')

    cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
    cy.get(DATA_SEARCH.input).focus().type('Dam 20{enter}')
    cy.wait(['@graphql', '@graphql'])
    cy.wait('@jsonapi')
    cy.contains('Adressen (').click()
    cy.contains("Data met 'Dam 20' (7 resultaten)")
    cy.contains('Adressen (7)')
    cy.go('back')
    cy.contains("Resultaten tonen binnen de categorie 'Data'").click()
  })
})
describe('open address', () => {
  it('should open the address detail panel', () => {
    cy.defineGeoSearchRoutes()
    cy.defineAddressDetailRoutes()
    cy.intercept('typeahead?q=ad+windighof+2*').as('getResults')

    // ensure the viewport is always the same in this test, so the clicks can be aligned properly
    cy.viewport(1000, 660)
    cy.hidePopup()
    cy.visit('/')
    cy.get(DATA_SEARCH.autoSuggestInput).focus().type('Ad Windighof 2')

    cy.wait('@getResults')
    cy.get(DATA_SEARCH.autoSuggestDropdown).contains('Ad Windighof 2').click({ force: true })
    cy.waitForAdressDetail()

    cy.get(ADDRESS_PAGE.resultsPanel).should('be.visible')
    cy.get(DETAIL_PANEL.heading).contains('Ad Windighof 2')
    cy.get(ADDRESS_PAGE.resultsPanel).get('dl').contains('1087HE').should('be.visible')

    cy.get(MAP.mapZoomIn).click()
    cy.get(MAP.mapZoomIn).click()
    cy.get(MAP.mapContainer).click(166, 304)

    // check that the address is open in right column
    cy.waitForGeoSearch()
    cy.get(GEO_SEARCH.listItem).contains('Ad Windighof 2').should('be.visible')
  })
})
