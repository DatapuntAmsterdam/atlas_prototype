import { DRAWING, MAP } from '../support/selectors'

// Skipping the execution of this test suite since the implementation of the drawing tool will change
describe.skip('Drawing', () => {
  describe('User should draw on the map not logged in', () => {
    beforeEach(() => {
      cy.hidePopup()
      cy.visit('/kaart')
    })
    it('Should draw multiple polygons on the map and delete them', () => {
      cy.intercept('**/dataselectie/bag/geolocation/*').as('getBagGeolocation')
      cy.intercept('**/dataselectie/bag/?shape*').as('getBagShape')

      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.buttonDraw).eq(1).click()

      cy.get(MAP.mapContainer).click(514, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(MAP.mapContainer).click(573, 203)
      cy.get(MAP.mapContainer).click(514, 320)
      cy.wait('@getBagShape')
      cy.wait('@getBagGeolocation')
      cy.get(DRAWING.polygon).should('be.visible').and('have.css', 'stroke', 'rgb(236, 0, 0)')
      cy.get(DRAWING.dropdownResults)
        .siblings()
        .find(DRAWING.dropdownResultsSelectedValue)
        .should('contain', 'Adressen')

      cy.get(DRAWING.linkDrawresult).should('be.visible')
      cy.get(DRAWING.linkDrawresult).first().should('have.text', 'Barndesteeg 1 A')
      cy.get(DRAWING.clusterSymbol).should('be.visible').and('have.length', 4)

      // Close drawtool
      cy.get(DRAWING.buttonCloseDrawTool).click()
      cy.get(DRAWING.clusterSymbol).should('not.exist')
      cy.get(DRAWING.polygon).should('not.exist')
      cy.get(DRAWING.linkDrawresult).should('not.exist')

      cy.get(DRAWING.buttonDrawTool).click()
      cy.wait('@getBagShape')
      cy.wait('@getBagGeolocation')
      cy.get(DRAWING.polygon).should('be.visible')

      // Draw anotyher polygon
      cy.get(DRAWING.buttonDraw).eq(1).click()
      cy.get(MAP.mapContainer).click(750, 320)
      cy.get(MAP.mapContainer).click(860, 320)
      cy.get(MAP.mapContainer).click(805, 203)
      cy.get(MAP.mapContainer).click(750, 320)
      cy.get(DRAWING.polygon).should('have.length', 2).and('be.visible')

      // Delete first polygon
      cy.get(MAP.mapContainer).click(600, 320)
      cy.get(DRAWING.buttonRemove).click()
      cy.get(DRAWING.polygon).should('have.length', 1).and('be.visible')
      cy.get(DRAWING.buttonCloseDrawTool).click()

      cy.pause()

      cy.get(DRAWING.linkDrawresult).should('not.exist')

      // Delete second polygon
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(MAP.mapContainer).click(860, 320)
      cy.get(DRAWING.buttonRemove).click()
      cy.get(DRAWING.polygon).should('have.length', 1).and('be.visible')
      cy.get(DRAWING.buttonCloseDrawTool).click()

      cy.pause()

      cy.get(DRAWING.linkDrawresult).should('not.exist')
    })
    it('Should draw multiple lines on the map and delete one', () => {
      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.buttonDraw).eq(0).click()

      cy.get(MAP.mapContainer).click(514, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(DRAWING.tooltip).should('have.text', '489.02 m').and('be.visible')
      cy.get(DRAWING.polygon).should('have.css', 'stroke', 'rgb(0, 160, 60)')

      cy.get(DRAWING.buttonCloseDrawTool).click()
      cy.get(DRAWING.polygon).should('not.exist')

      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.polygon).should('be.visible')
      cy.get(DRAWING.buttonDraw).eq(0).click()

      cy.get(MAP.mapContainer).click(514, 420)
      cy.get(MAP.mapContainer).click(660, 420)
      cy.get(MAP.mapContainer).click(660, 420)

      cy.get(DRAWING.polygon).should('have.length', 2).and('be.visible')
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(DRAWING.buttonRemove).click()
      cy.get(DRAWING.polygon).should('have.length', 1).and('be.visible')
      cy.get(DRAWING.buttonCloseDrawTool).click()
    })
  })
  describe('User should draw on the map logged in', () => {
    beforeEach(() => {
      cy.login('EMPLOYEE_PLUS')
    })

    after(() => {
      cy.logout()
    })
    it('Should see vestigingen', () => {
      cy.hidePopup()
      cy.visit('/kaart')
      cy.intercept('**/dataselectie/bag/geolocation/*').as('getBagGeolocation')
      cy.intercept('**/dataselectie/bag/?shape*').as('getBagShape')
      cy.intercept('**/dataselectie/hr/geolocation/*').as('getHrGeoloaction')
      cy.intercept('**/dataselectie/hr/?shape*').as('getHrShape')

      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.buttonDraw).eq(1).click()

      cy.get(MAP.mapContainer).click(514, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(MAP.mapContainer).click(573, 203)
      cy.get(MAP.mapContainer).click(514, 320)
      cy.wait('@getBagShape')
      cy.wait('@getBagGeolocation')
      cy.get(DRAWING.dropdownResults).eq(1).select('Vestigingen')
      cy.wait('@getHrGeoloaction')
      cy.wait('@getHrShape')
      cy.get(DRAWING.linkDrawresult).should('be.visible')
      cy.contains('"Old Bridge" Souvenierwinkel')
      cy.get(DRAWING.clusterSymbol).should('be.visible').and('have.length', 3)
    })
    it('Should see kadastrale objecten', () => {
      cy.hidePopup()
      cy.visit('/kaart')
      cy.intercept('**/dataselectie/bag/geolocation/*').as('getBagGeolocation')
      cy.intercept('**/dataselectie/bag/?shape*').as('getBagShape')
      cy.intercept('**/dataselectie/brk/geolocation/*').as('getBrkGeoloaction')
      cy.intercept('**/dataselectie/brk/kot/?shape*').as('getBrkShape')

      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.buttonDraw).eq(1).click()

      cy.get(MAP.mapContainer).click(514, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(MAP.mapContainer).click(573, 203)
      cy.get(MAP.mapContainer).click(514, 320)
      cy.wait('@getBagGeolocation')
      cy.wait('@getBagShape')
      cy.get(DRAWING.dropdownResults).eq(1).select('Kadastrale objecten')
      cy.wait('@getBrkShape')
      cy.wait('@getBrkGeoloaction')
      cy.get(DRAWING.linkDrawresult).should('be.visible')
      cy.contains('ASD04 F 06476 G 0000')
    })
  })
})
