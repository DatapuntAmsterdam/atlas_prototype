import { getCountFromHeader } from '../support/helper-functions'
import { ADDRESS_PAGE, DATA_SELECTION_TABLE, HEADINGS, MAP, TABLES } from '../support/selectors'

describe('addresses module', () => {
  beforeEach(() => {
    cy.server()
    cy.route('/dataselectie/bag/*').as('getResults')

    cy.hidePopup()

    cy.visit('/data/bag/adressen/?modus=volledig')
    cy.get(ADDRESS_PAGE.dataSelection).should('exist').and('be.visible')
  })

  describe('user should see the addresses table in full mode', () => {
    it('should open the address catalogus', () => {
      cy.get(HEADINGS.dataSelectionHeading).contains('Adressen').should('exist').and('be.visible')

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
          const category = group[0].children[0].innerText
          // get the innerText of the first nested li
          const selectedFilter = group[0].children[1].children[0].innerText
          // click the filter that contains the selectedFilter variable
          cy.get(TABLES.filterItem).find(TABLES.filterLabel).contains(selectedFilter).click()

          cy.wait('@getResults')

          // the filter should be added to the active filters (stadsdeel)
          cy.get(TABLES.activeFilterItem)
            .find('span')
            .contains(selectedFilter)
            .should('exist')
            .scrollIntoView()
            .and('be.visible')

          // get the position of the category in the th's of the table
          cy.get(`${DATA_SELECTION_TABLE.head} ${DATA_SELECTION_TABLE.cell}`).each((th, index) => {
            // if the position is equal to the category
            if (th[0].innerText === category) {
              // get al the content the td's with the same position as the categoryGroup they all
              // should contain the same value as the `selectedFilter`
              cy.get(DATA_SELECTION_TABLE.row)
                .find(`${DATA_SELECTION_TABLE.cell}:nth-child(${index + 1})`)
                .contains(selectedFilter)
                .should('exist')
                .and('be.visible')
            }
          })
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

              cy.get(TABLES.detailPane).should('exist').and('be.visible')
              cy.get('dt').contains(selectedGroup).should('exist').and('be.visible')
              cy.get('dt')
                .contains(selectedGroup)
                .siblings('dd')
                .contains(selectedValue)
                .should('exist')
                .and('be.visible')
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
            .then((firstValue) => {
              const selectedValue = firstValue[0].innerText.trim()
              // click on the firstItem to open address preview panel
              cy.get(`${DATA_SELECTION_TABLE.body} ${DATA_SELECTION_TABLE.row}`).first().click()
              // the detail view should exist
              cy.get(TABLES.detailPane).should('exist').and('be.visible')
              // the map view maximize button should exist
              cy.get(ADDRESS_PAGE.buttonMaximizeMap).should('exist')
              // click on the maximize button to open the map view
              cy.get(ADDRESS_PAGE.buttonMaximizeMap).first().click()

              cy.wait('@getNummeraanduiding')
              cy.wait('@getVerblijfsobject')

              // the preview panel should exist
              cy.get(MAP.mapPreviewPanel).should('exist').and('be.visible')
              // the preview panel has the right title
              cy.get(ADDRESS_PAGE.mapDetailResultHeader)
                .contains(selectedValue)
                .should('exist')
                .and('be.visible')
              // the show more button should exist and be visible
              cy.get(ADDRESS_PAGE.buttonShowMore).should('exist').scrollIntoView().and('be.visible')
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
      cy.get(ADDRESS_PAGE.iconMapMarker).should('exist').and('be.visible')
    })
  })

  describe('user should be be able to filter on an area', () => {
    it('should show the addresses and map when selected', () => {
      cy.route('/dataselectie/bag/geolocation/*').as('getGeoResults')

      let totalCount

      // Get the number in the title before filtering
      cy.get(HEADINGS.dataSelectionHeading).then((title) => {
        totalCount = getCountFromHeader(title.text())
      })

      // click on "AMC" in the left filter menu
      cy.get(TABLES.filterItem).contains('AMC').click()
      cy.wait('@getResults')

      // Expect the number in the title after filtering to be smaller than the number before
      // filtering
      cy.get(HEADINGS.dataSelectionHeading).then((title) => {
        const filteredCount = getCountFromHeader(title.text())
        expect(filteredCount).to.be.below(totalCount)
      })

      // click on "kaart weergeven"
      cy.get(ADDRESS_PAGE.buttonOpenMap).click()
      cy.wait('@getGeoResults')

      // map should be visible now
      cy.get(ADDRESS_PAGE.mapContainer).should('exist').and('be.visible')
      // , with large right column
      cy.get(ADDRESS_PAGE.resultsPanel).should('exist').and('be.visible')
      // count the number of cluster icons on the map
      cy.get(ADDRESS_PAGE.iconCluster).then((items) => {
        expect(items.length).to.gte(1)
      })
      // list should be visible in right column
      cy.get(ADDRESS_PAGE.resultsList).should('exist').and('be.visible')
      // active filter should show
      cy.get(TABLES.activeFilterItem).contains('AMC').should('exist').and('be.visible')
    })
  })
})
