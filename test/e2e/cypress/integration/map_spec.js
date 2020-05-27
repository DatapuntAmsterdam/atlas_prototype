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
      cy.get(MAP.legendNotification)
        .first()
        .scrollIntoView()
        .contains('Zichtbaar bij verder inzoomen')
        .and('is.visible')
      cy.get(MAP.mapZoomIn).click()

      // wait for the second click
      cy.wait(250)
      cy.get(MAP.mapZoomIn).click()
      cy.get(MAP.legendNotification).should('not.be.visible')
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

  describe('Should see less when logged in', () => {
    it('should add a layer to the map', () => {
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route(/\/typeahead\?q=spuistraat 59a/).as('getTypeaheadResults')
      cy.route('/panorama/thumbnail/*').as('getPanorama')
      cy.route('/bag/v1.1/verblijfsobject/*').as('getVerblijfsobject')
      cy.hidePopup()
      cy.visit(`/`)
      cy.get(HOMEPAGE.navigationBlockKaart).click()
      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.url().should('include', '/data/?modus=kaart&legenda=true')
      cy.get(MAP.mapContainer).should('be.visible')

      // Legend and checkboxes are not visible
      cy.get(MAP.mapLegend).should('not.be.visible')
      cy.contains('Kadastrale perceelsgrenzen').should('not.be.visible')
      cy.contains('Kadastrale eigenaren').should('not.be.visible')
      cy.contains('Kadastrale erfpachtuitgevers').should('not.be.visible')
      cy.contains('Gemeentelijk eigendom').should('not.be.visible')
      cy.contains('Gemeentelijke beperkingen (WKPB)').should('not.be.visible')
      cy.get(MAP.legendNotification).should('not.be.visible')
      cy.contains('Panden ouder dan 1960').should('not.be.visible')
      cy.contains('Panden naar bouwjaar').should('not.be.visible')

      cy.get('.map-panel-handle > :nth-child(3)').click('right')

      // Legend and checkboxes are visible
      cy.get(MAP.mapLegend).should('be.visible')
      cy.contains('Kadastrale perceelsgrenzen').should('be.visible')
      cy.contains('Kadastrale eigenaren').should('be.visible')
      cy.contains('Kadastrale erfpachtuitgevers').should('be.visible')
      cy.contains('Gemeentelijk eigendom').should('be.visible')
      cy.contains('Gemeentelijke beperkingen (WKPB)').should('be.visible')
      cy.get(MAP.legendNotification).should('be.visible')
      cy.contains('Panden ouder dan 1960').should('be.visible')
      cy.contains('Panden naar bouwjaar').should('be.visible')

      // Checkboxes related to Kadastrale perceelsgrenzen are not visible
      cy.get(MAP.checkboxBurgerlijkeGemeente).should('not.be.visible')
      cy.get(MAP.checkboxKadastraleGemeente).should('not.be.visible')
      cy.get(MAP.checkboxKadastraleSectie).should('not.be.visible')
      cy.get(MAP.checkboxKadastraalObject).should('not.be.visible')

      cy.get(MAP.mapZoomIn).click()
      cy.get(MAP.mapOverlayPane).children().should('not.exist')
      cy.get(MAP.imageLayer).should('not.exist')
      cy.get(MAP.checkboxKadastralePercelen).click()

      // Checkboxes related to Kadastrale perceelsgrenzen are visible
      cy.get(MAP.checkboxBurgerlijkeGemeente).should('be.visible').and('be.checked')
      cy.get(MAP.checkboxKadastraleGemeente).should('be.visible').and('be.checked')
      cy.get(MAP.checkboxKadastraleSectie).should('be.visible').and('be.checked')
      cy.get(MAP.checkboxKadastraalObject).should('be.visible').and('be.checked')

      // Check if layers exists
      cy.get(MAP.imageLayer).should('have.length', 4)

      cy.get(MAP.checkboxKadastralePercelen).click()
      cy.get(MAP.mapOverlayPane).children().should('not.exist')
      cy.get(MAP.checkboxKadastralePercelen).click()

      cy.get(MAP.checkboxKadastraleGemeente).uncheck()
      cy.get(MAP.checkboxKadastraleSectie).uncheck()

      // Check if 2 layers are visible and 2 are not visible, based on opacity
      cy.get(MAP.imageLayer)
        .eq(0)
        .should('have.attr', 'style', 'opacity: 100; visibility: visible;')
      cy.get(MAP.imageLayer)
        .eq(3)
        .should('have.attr', 'style', 'opacity: 100; visibility: visible;')
      cy.get(MAP.imageLayer).eq(1).should('have.attr', 'style', 'opacity: 0; visibility: visible;')
      cy.get(MAP.imageLayer).eq(2).should('have.attr', 'style', 'opacity: 0; visibility: visible;')

      // TODO

      cy.get(MAP.iconMapMarker).should('not.be.visible')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().type('Spuistraat 59A')

      cy.wait('@getTypeaheadResults')
      cy.get(DATA_SEARCH.autoSuggest).contains('Spuistraat 59A').click()
      cy.wait('@getVerblijfsobject')
      cy.wait('@getPanorama')
      cy.get(MAP.mapZoomIn).click({ force: true })
      cy.get(MAP.mapDetailResultPanel).should('exist').and('be.visible')
      cy.get(MAP.iconMapMarker).should('be.visible')

      cy.get(`#${CSS.escape('Onroerende zaken')}`).click()
      cy.get(`#${CSS.escape('Onroerende zaken')}`).click()
      cy.get(MAP.imageLayer).should('not.exist')
    })
    it('should see no layers vestigingen on the map if not logged in', () => {
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route(/\/typeahead\?q=spuistraat 59a/).as('getTypeaheadResults')
      cy.route('/panorama/thumbnail/*').as('getPanorama')
      cy.route('/bag/v1.1/verblijfsobject/*').as('getVerblijfsobject')
      cy.hidePopup()
      cy.visit(`/`)
      cy.get(HOMEPAGE.navigationBlockKaart).click()
      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.url().should('include', '/data/?modus=kaart&legenda=true')
      cy.get(MAP.mapContainer).should('be.visible')

      cy.get('.map-panel-handle > :nth-child(20)').click('right')

      cy.get(MAP.checkboxVestigingBouw).check().should('be.checked')
      cy.get(MAP.checkboxVestigingCultuur).check().should('be.checked')
      cy.get(MAP.checkboxVestigingFinance).check().should('be.checked')
      cy.get(MAP.checkboxVestigingHandel).check().should('be.checked')
      cy.get(MAP.checkboxVestigingHoreca).check().should('be.checked')
      cy.get(MAP.checkboxVestigingIt).check().should('be.checked')
      cy.get(MAP.checkboxVestigingLandbouw).check().should('be.checked')
      cy.get(MAP.checkboxVestigingOverheid).check().should('be.checked')
      cy.get(MAP.checkboxVestigingPersDiensverlening).check().should('be.checked')
      cy.get(MAP.checkboxVestigingProductie).check().should('be.checked')
      cy.get(MAP.checkboxVestigingZakDienstverlening).check().should('be.checked')
      cy.get(MAP.checkboxVestigingOverige).check().should('be.checked')

      // All 12 layers are visible after login
      cy.get(MAP.legendNotification)
        .should('contain', 'Zichtbaar na inloggen')
        .and('have.length', 12)
    })
  })
  describe('Should see more when logged in', () => {
    before(() => {
      cy.login()
    })

    after(() => {
      cy.logout()
    })
    it('Should see vestigingen on the map', () => {
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route(/\/typeahead\?q=spuistraat 59a/).as('getTypeaheadResults')
      cy.route('/panorama/thumbnail/*').as('getPanorama')
      cy.route('/bag/v1.1/verblijfsobject/*').as('getVerblijfsobject')
      cy.hidePopup()
      cy.visit(`/`)
      cy.get(HOMEPAGE.navigationBlockKaart).click()
      cy.wait('@graphql')
      cy.wait('@graphql')
      cy.url().should('include', '/data/?modus=kaart&legenda=true')
      cy.get(MAP.mapContainer).should('be.visible')

      cy.get('.map-panel-handle > :nth-child(20)').click('right')
      cy.get(MAP.imageLayer).should('not.exist')

      cy.get(MAP.checkboxVestigingBouw).check().should('be.checked')
      cy.get(MAP.checkboxVestigingCultuur).check().should('be.checked')
      cy.get(MAP.checkboxVestigingFinance).check().should('be.checked')
      cy.get(MAP.checkboxVestigingHandel).check().should('be.checked')
      cy.get(MAP.checkboxVestigingHoreca).check().should('be.checked')
      cy.get(MAP.checkboxVestigingIt).check().should('be.checked')
      cy.get(MAP.checkboxVestigingLandbouw).check().should('be.checked')
      cy.get(MAP.checkboxVestigingOverheid).check().should('be.checked')
      cy.get(MAP.checkboxVestigingPersDiensverlening).check().should('be.checked')
      cy.get(MAP.checkboxVestigingProductie).check().should('be.checked')
      cy.get(MAP.checkboxVestigingZakDienstverlening).check().should('be.checked')
      cy.get(MAP.checkboxVestigingOverige).check().should('be.checked')

      // Selection of layers results in 12
      cy.get(MAP.imageLayer).should('exist').and('have.length', 12)

      // All 12 layers are visible after login
      cy.get(MAP.mapLegendItems).should('have.length', 12)

      // No message to first login
      cy.get(MAP.legendNotification).should('not.be.visible')
    })
  })
})
