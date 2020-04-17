import PARAMETERS from '../../../../src/store/parameters'
import { routing } from '../../../../src/app/routes'
import { ADDRESS_PAGE, DATA_SEARCH, HOMEPAGE, MAP } from '../support/selectors'

const { VIEW, VIEW_CENTER } = PARAMETERS

describe('map module', () => {
  describe('user should be able to navigate to the map from the homepage', () => {
    it('should open the map', () => {
      cy.server()
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.hidePopup()
      cy.visit('/')

      cy.wait('@jsonapi')
      cy.get(HOMEPAGE.navigationBlockKaart).should('exist').and('be.visible')
      cy.get(MAP.mapContainer).should('not.exist')
      cy.get(HOMEPAGE.navigationBlockKaart).click()
      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.url().should('include', '/data/?modus=kaart&legenda=true')
      cy.get(MAP.mapContainer).should('exist').and('be.visible')
    })
  })

  describe('user should be able to interact with the map', () => {
    it('should show results based on the interaction with the map', () => {
      const svgMapPath = '/assets/images/map/'
      cy.server()
      cy.defineGeoSearchRoutes()
      cy.defineAddressDetailRoutes()

      // Use regular expression to match spaces
      cy.route(/\/typeahead\?q=dam 1/).as('getTypeaheadResults')

      // ensure the viewport is always the same in this test, so the clicks can be aligned properly
      cy.viewport(1000, 660)
      cy.hidePopup()
      cy.visit('/')

      cy.get(HOMEPAGE.navigationBlockKaart).click()
      cy.get(DATA_SEARCH.autoSuggestInput).focus().type('dam 1')

      cy.wait('@getTypeaheadResults')
      cy.get(DATA_SEARCH.autoSuggest).contains('Dam 1').click()

      cy.wait('@getVerblijfsobject')
      // check that the circle icon is drawed on the map
      cy.get(MAP.iconMapMarker)
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'src', `${svgMapPath}detail.svg`)
      cy.checkPreviewPanel(['Dam 1', 'winkelfunctie'])

      // click somewhere in the map (not on a marker)
      cy.get(ADDRESS_PAGE.mapContainer).click(560, 293)

      cy.waitForGeoSearch()
      cy.get(MAP.iconMapMarker)
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'src', `${svgMapPath}search.svg`)

      cy.get(MAP.mapPreviewPanelVisible).contains('Beursplein 15').click()

      cy.get(MAP.iconMapMarker)
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'src', `${svgMapPath}detail.svg`)
      cy.get(MAP.mapPreviewPanelVisible)
        .get(MAP.mapDetailPanoramaHeaderImage)
        .should('exist')
        .and('be.visible')
      cy.checkPreviewPanel(['Type adres', 'Hoofdadres'])

      // click on the button inside the panel balloon thingy, and expect the large right column to
      // become visible
      cy.get(MAP.buttonEnlarge).click()
      cy.get(ADDRESS_PAGE.resultsPanel).should('exist').and('be.visible')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getPanden')
      cy.wait('@getObjectExpand')
      cy.wait('@getSitueringen')
      cy.wait('@getMonument')
      cy.get(ADDRESS_PAGE.resultsPanel)
        .get(ADDRESS_PAGE.resultsPanelTitle)
        .contains('Beursplein 15')
      cy.get(ADDRESS_PAGE.resultsPanel).get('dl').contains('1012JW')
      cy.wait('@getPanorama')
      cy.get(ADDRESS_PAGE.resultsPanel)
        .get(ADDRESS_PAGE.panoramaThumbnail)
        .should('exist')
        .and('be.visible')
    })

    it.skip('should remember the state when navigating back', () => {
      cy.server()
      cy.route('/geosearch/search/?*').as('getSearchResults')
      cy.route('/meetbouten/meetbout/*').as('getMeetbout')
      cy.route('/panorama/thumbnail/*').as('getPanoThumbnail')
      // ensure the viewport is always the same in this test, so the clicks can be aligned properly
      cy.viewport(1000, 660)
      cy.hidePopup()
      cy.visit(`data/?center=52.3728007%2C4.899258&modus=kaart`)
      cy.get(MAP.mapPanel).should('have.class', 'map-panel--collapsed')
      cy.get(MAP.toggleMapPanel).click()
      cy.get(MAP.mapPanel).should('have.class', 'map-panel--expanded')
      cy.get(DATA_SEARCH.scrollWrapper).should('exist').and('be.visible')
      cy.get('#Hoogte').check()
      cy.contains('Meetbouten - Zaksnelheid').click()
      // cy.get(DATA_SEARCH.scrollWrapper).scrollTo('t')
      cy.get(DATA_SEARCH.legendNotification)
        .first()
        .scrollIntoView()
        .contains('Zichtbaar bij verder inzoomen')
        .and('is.visible')
      cy.get(MAP.mapZoomIn).click()

      // wait for the second click
      cy.wait(250)
      cy.get(MAP.mapZoomIn).click()
      cy.get(DATA_SEARCH.legendNotification).should('not.be.visible')
      cy.get('.map-legend__items').should('exist').and('be.visible')

      cy.wait(250)
      cy.get(ADDRESS_PAGE.mapContainer).click(702, 517)

      cy.wait('@getSearchResults')
      cy.wait('@getMeetbout')
      cy.checkPreviewPanel(['Nieuwmarkt 25', '10581111'])

      cy.get('button.map-search-results__button').click()

      cy.wait('@getPanoThumbnail')
      cy.get(ADDRESS_PAGE.resultsPanel).should('exist').and('be.visible')
      cy.get(ADDRESS_PAGE.resultsPanel).get(ADDRESS_PAGE.resultsPanelTitle).contains('10581111')
      cy.get(ADDRESS_PAGE.resultsPanel).get('dl').contains('Nieuwmarkt 25')
      cy.get(ADDRESS_PAGE.resultsPanel)
        .get(ADDRESS_PAGE.panoramaThumbnail)
        .should('exist')
        .and('be.visible')

      // the map view maximize button should exist
      cy.get('button.icon-button__right')
      // click on the maximize button to open the map view
      cy.get('button.icon-button__right').first().click()

      cy.get(MAP.mapPreviewPanelVisible)
        .get(MAP.mapDetailPanoramaHeaderImage)
        .should('exist')
        .and('be.visible')
      cy.checkPreviewPanel(['Nieuwmarkt 25', '10581111'])

      // Known issue, back doesn't work in this case
      // cy.go('back')

      // cy.get(ADDRESS_PAGE.resultsPanel).should('exist').and('be.visible')
      // cy.get(ADDRESS_PAGE.resultsPanel).get(ADDRESS_PAGE.resultsPanelTitle).contains('10581111')
      // cy.get(ADDRESS_PAGE.resultsPanel).get('dl').contains('Nieuwmarkt 25')
      // cy.get(ADDRESS_PAGE.resultsPanel)
      //   .get(ADDRESS_PAGE.panoramaThumbnail)
      //   .should('exist')
      //   .and('be.visible')

      // cy.go('back')

      // cy.get(ADDRESS_PAGE.resultsPanel).should('exist').and('not.be.visible')
      // cy.get(MAP.mapPreviewPanelVisible).should('exist').and('be.visible')
      // cy.checkPreviewPanel(['Nieuwmarkt 25', '10581111'])
    })
  })

  describe('user should be able to use the map', () => {
    it('should render the leaflet map', () => {
      cy.server()
      cy.hidePopup()
      cy.visit(`/${routing.data.path}?${VIEW}=kaart`)
      cy.get(ADDRESS_PAGE.mapContainer).should('exist').and('be.visible')
      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get('.leaflet-tile-container').should('exist').and('be.visible')
    })

    it('should add a map-layer to the leaflet map', () => {
      cy.server()
      cy.hidePopup()
      cy.visit(`/${routing.data.path}?${VIEW_CENTER}=52.3731081%2C4.8932945&${VIEW}=kaart`)
      // the map-panel should have the class collapsed by default
      cy.get(MAP.mapPanel).should('have.class', 'map-panel--collapsed')
      // expand the map-panel
      cy.get(MAP.toggleMapPanel).click()
      // the map panel should have the class expanded
      cy.get(MAP.mapPanel).should('have.class', 'map-panel--expanded')
      // the scroll wrapper should be visible when map panel is expanded
      cy.get(DATA_SEARCH.scrollWrapper).should('exist').and('be.visible')
      // get Gebiedsindeling map-layer button
      cy.get('#Gebiedsindeling').check()
      // check if the map has overlay panes
      cy.get(MAP.mapOverlayPane).children().should('exist')
      // check if there is a canvas element inside the first overlay pane
      cy.get(MAP.mapOverlayPane).find('canvas').should('exist')
    })
  })

  describe('user should be able to open the map panel when collapsed', () => {
    it('should add open the map panel component', () => {
      cy.server()
      cy.hidePopup()
      cy.visit(`/${routing.data.path}?${VIEW}=kaart`)

      cy.get(MAP.mapPanel).should('have.class', 'map-panel--collapsed')
      cy.get(DATA_SEARCH.scrollWrapper).should('not.be.visible')
      cy.get(MAP.toggleMapPanel).click()
      cy.get(MAP.mapPanel).should('have.class', 'map-panel--expanded')
      cy.get(DATA_SEARCH.scrollWrapper).should('exist').and('be.visible')
    })
  })
})
