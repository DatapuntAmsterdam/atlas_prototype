import { ADDRESS_PAGE, DATA_SEARCH, HOMEPAGE, MAP, TABLES, PANORAMA } from '../support/selectors'

describe('panorama module', () => {
  beforeEach(() => {
    cy.server()
    cy.route('/panorama/panoramas/*/adjacencies/?newest_in_range=true&tags=mission-bi').as(
      'getResults',
    )

    cy.route('POST', '/cms_search/graphql/').as('graphql')
    cy.route('/jsonapi/node/list/**').as('jsonapi')
    cy.hidePopup()

    cy.visit('/')

    cy.wait('@jsonapi')

    cy.get(HOMEPAGE.navigationBlockPanorama)
    cy.get(PANORAMA.panorama).should('not.exist')

    cy.get(HOMEPAGE.navigationBlockPanorama).click()
    cy.wait('@getResults')
  })

  describe('user should be able to navigate to the panorama from the homepage', () => {
    it('should open the panorama viewer', () => {
      cy.get(PANORAMA.homepage).should('not.be.visible')
      cy.get(PANORAMA.panorama).should('exist').and('be.visible')
    })
  })

  describe('user should be able to use the panorama viewer', () => {
    it('should be able to click a hotspot and change the coordinates', () => {
      cy.get(PANORAMA.statusBarCoordinates)
        .first()
        .then((coordinatesEl) => {
          const coordinates = coordinatesEl[0].innerText

          cy.get(PANORAMA.statusBarCoordinates).first().contains(coordinates).should('exist')

          // the click the first hotspot
          cy.get('.qa-hotspot-button:visible').first().click()

          cy.wait('@getResults')
          // the coordinates should be different
          cy.get(PANORAMA.statusBarCoordinates)
            .first()
            .find('span')
            .contains(coordinates)
            .should('not.exist')
        })
    })
  })

  describe('user should be able to use the leaflet map', () => {
    it('should render the leaflet map and set the marker', () => {
      // the canvas inside de marzipano viewer should exist and be visible
      cy.get(PANORAMA.markerPane).find('img').should('exist').and('be.visible')
      cy.get(MAP.imageLayer).should('exist')
    })

    it('should set the panoramabeelden as active layers in the map-panel legenda', () => {
      // open the the map panel (closed initially)
      cy.get(MAP.toggleMapPanel).click()
      cy.get(MAP.checkboxPanoramabeelden).should('have.attr', 'checked')
    })

    it('should set the layers in the leaflet map', () => {
      cy.get(MAP.imageLayer).should('exist')
    })

    it('should change the coordinates when clicked on the map', () => {
      cy.get(PANORAMA.statusBarCoordinates)
        .first()
        .then((coordinatesEl) => {
          const coordinates = coordinatesEl[0].innerText

          cy.get(PANORAMA.statusBarCoordinates).first().contains(coordinates).should('exist')

          // click on the leaflet map with a different position
          cy.get(MAP.mapContainer).trigger('click', 20, 100)

          cy.wait('@getResults')
          // the coordinates should be different
          cy.get(PANORAMA.statusBarCoordinates).first().contains(coordinates).should('not.exist')
        })
    })
  })

  describe('user should be able to interact with the panorama', () => {
    it('should remember the state when closing the pano, and update to search results when clicked in map', () => {
      const panoUrl =
        '/data/panorama/TMX7316010203-000355_pano_0000_000850/?center=52.3663697%2C4.8833909&detail-ref=0363300000004153%2Cbag%2Copenbareruimte' +
        '&heading=117.99999999999999&lagen=pano-pano2016bi%3A1%7Cpano-pano2017bi%3A1%7Cpano-pano2018bi%3A1%7Cpano-pano2019bi%3A1%7Cpano-pano2020bi%3A1' +
        '&locatie=52.3663696651629%2C4.88339092332249&reference=03630000004153%2Cbag%2Copenbareruimte'
      let newUrl

      cy.defineGeoSearchRoutes()
      cy.route('/bag/v1.1/openbareruimte/*').as('getOpenbareRuimte')
      cy.route('/panorama/thumbnail/*').as('getPanoThumbnail')
      cy.route('/typeahead?q=leidsegracht').as('getSuggestions')

      cy.viewport(1000, 660)
      cy.get(PANORAMA.markerPane).find('img').should('exist').and('be.visible')
      cy.get(DATA_SEARCH.autoSuggestInput).type('Leidsegracht')
      cy.wait('@getSuggestions')
      cy.get(DATA_SEARCH.autoSuggest).contains('Leidsegracht').click()

      cy.wait('@getOpenbareRuimte')
      cy.wait('@getPanoThumbnail')
      cy.get(ADDRESS_PAGE.panoramaThumbnail).should('exist').and('be.visible')
      cy.get(TABLES.detailTitle).should('exist').and('be.visible').contains('Leidsegracht')
      cy.get(ADDRESS_PAGE.panoramaThumbnail).click()

      cy.wait('@getResults')
      cy.wait('@getPanoThumbnail')
      cy.wait('@getOpenbareRuimte')

      cy.location().then((loc) => {
        newUrl = `${loc.pathname + loc.search}&reference=03630000004153%2Cbag%2Copenbareruimte`
        expect(newUrl).to.equal(panoUrl)
      })

      let largestButtonSize = 0
      let largestButton
      cy.get('.qa-hotspot-rotation')
        .each((button) => {
          // get largest (e.g. closest by) navigation button
          cy.wrap(button)
            .should('have.css', 'width')
            .then((width) => {
              if (parseInt(width.replace('px', ''), 10) > largestButtonSize) {
                largestButtonSize = parseInt(width.replace('px', ''), 10)
                largestButton = button
              }
            })
        })
        .then(() => {
          largestButton.click()
        })

      cy.wait('@getResults')
      // verify that something happened by comparing the url
      cy.location().then((loc) => {
        newUrl = loc.pathname + loc.search
        expect(newUrl).not.to.equal(panoUrl)
      })

      cy.get(ADDRESS_PAGE.buttonMaximizeMap).should('exist')
      // click on the maximize button to open the map view
      cy.wait(1000)
      cy.get(ADDRESS_PAGE.buttonMaximizeMap).last().click()

      cy.wait('@getOpenbareRuimte')
      cy.wait('@getPanoThumbnail')

      cy.get(ADDRESS_PAGE.panoramaThumbnail, { timeout: 10000 }).should('exist').and('be.visible')
      cy.get(TABLES.detailTitle).should('exist').and('be.visible').contains('Leidsegracht')
      cy.get(ADDRESS_PAGE.panoramaThumbnail).click()

      cy.get(MAP.mapContainer).click(20, 100)

      cy.wait('@getResults')

      // verify that something happened by comparing the url
      cy.location().then((loc) => {
        const thisUrl = loc.pathname + loc.hash
        expect(thisUrl).not.to.equal(newUrl)
      })
      cy.get(ADDRESS_PAGE.buttonMaximizeMap).last().click()

      // should show the openbareruimte again
      cy.wait('@getPanoThumbnail')
      cy.wait('@getResults')
      cy.get(ADDRESS_PAGE.panoramaThumbnail).should('exist').and('be.visible')
      cy.contains('Elandsgracht')
    })
  })
})
