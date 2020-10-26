import {
  COMPONENTS,
  DATA_DETAIL,
  DATA_SEARCH,
  HOMEPAGE,
  MAP,
  MAP_LAYERS,
  PRINT,
} from '../support/selectors'

const PRINT_BUTTON = `${COMPONENTS.shareBar} button[title="Print deze pagina"]`

describe('print module', () => {
  beforeEach(() => {
    cy.server()
    cy.route('/meetbouten/meetbout/*').as('getResults')
    cy.route('/meetbouten/meting/?meetbout=*').as('getMeeting')
    cy.route('/jsonapi/node/list/**').as('jsonapi')

    cy.hidePopup()

    cy.visit('/')
    cy.wait('@jsonapi')
  })

  it('Should search a meetbout and print the information', () => {
    cy.route('/typeahead?q=10581111').as('getTypeAhead')
    cy.route('/panorama/thumbnail?*').as('getPanoThumbnail')
    cy.get(DATA_SEARCH.autoSuggestInput).type('10581111')
    cy.wait('@getTypeAhead')
    cy.wait(500)
    cy.get(DATA_SEARCH.autoSuggest).contains('10581111').click()
    cy.wait('@getResults')
    cy.wait('@getMeeting')
    cy.wait('@getPanoThumbnail')
    cy.get(COMPONENTS.panoramaPreview).should('exist').and('be.visible')
    cy.get(DATA_DETAIL.heading).should('exist').and('be.visible').contains('10581111')
    cy.get(PRINT_BUTTON).first().should('exist').click()
    cy.get(PRINT.headerTitle).should('exist').and('be.visible')
    cy.get(PRINT.buttonClosePrint).click()
    cy.get(PRINT.headerTitle).should('not.exist')
    cy.get(COMPONENTS.panoramaPreview).should('exist').and('be.visible')
    cy.get(DATA_DETAIL.heading).should('exist').and('be.visible').contains('10581111')
  })
  it('Should click on a map to open meetbout information and print the information', () => {
    cy.route('POST', '/cms_search/graphql/').as('graphql')
    cy.defineAddressDetailRoutes()
    cy.defineGeoSearchRoutes()
    cy.get(HOMEPAGE.navigationBlockKaart).click()
    cy.wait('@graphql')
    cy.wait('@graphql')
    cy.get(MAP.mapPanelHandle)
      .find(MAP.mapLegendLabel)
      .contains('Ondergrond')
      .parents(MAP.mapLegendItemButton)
      .click('right')
    cy.get(MAP_LAYERS.checkboxOndergrond).check({ force: true })
    cy.visit('/data/bag/verblijfsobject/id0363010000751893/?lagen=ondrgd-mbz%3A1&zoom=16')
    cy.waitForAdressDetail()
    cy.get(MAP.mapContainer).click(166, 304)
    cy.waitForGeoSearch()
    cy.wait('@getNummeraanduiding')
    cy.wait('@getMonument')
    cy.contains('10581112').click()
    cy.wait('@getResults')
    cy.wait('@getMeeting')
    cy.get(COMPONENTS.panoramaPreview).should('exist').and('be.visible')
    cy.get(DATA_DETAIL.heading).should('exist').and('be.visible').contains('10581112')
    cy.get(PRINT_BUTTON).first().should('exist').click()
    cy.get(PRINT.headerTitle).should('exist').and('be.visible')
    cy.get(PRINT.buttonClosePrint).click()
    cy.get(PRINT.headerTitle).should('not.exist')
    cy.get(COMPONENTS.panoramaPreview).should('exist').and('be.visible')
    cy.get(DATA_DETAIL.heading).should('exist').and('be.visible').contains('10581112')
  })
})
