import { DRAWING, MAP } from '../support/selectors'

describe('Drawing', () => {
  describe('User should draw on the map not logged in', () => {
    beforeEach(() => {
      cy.hidePopup()
      cy.visit('/kaart')
    })
    it('Should draw multiple polygons on the map and delete one', () => {
      cy.server()
      cy.route('/dataselectie/bag/geolocation/*').as('getBagGeolocation')
      cy.route('/dataselectie/bag/?shape*').as('getBagShape')

      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.buttonDrawTool).eq(2).click()

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
        .should('have.text', 'Adressen')
      cy.get(DRAWING.linkDrawresult).should('have.length', 20)
      cy.get(DRAWING.linkDrawresult).first().should('have.text', 'Barndesteeg 1 A')
      cy.get(DRAWING.clusterSymbol).should('be.visible').and('have.length', 4)

      // Close drawtool
      cy.get(DRAWING.buttonDrawTool).first().click()
      cy.get(DRAWING.clusterSymbol).should('not.be.visible')
      cy.get(DRAWING.polygon).should('not.be.visible')
      cy.get(DRAWING.linkDrawresult).should('not.be.visible')

      cy.get(DRAWING.buttonDrawTool).click()
      cy.wait('@getBagShape')
      cy.wait('@getBagGeolocation')
      // Polygon visible again
      cy.get(DRAWING.polygon).should('be.visible')

      // Draw anotyher polygon
      cy.get(DRAWING.buttonDrawTool).eq(2).click()
      cy.get(MAP.mapContainer).click(750, 320)
      cy.get(MAP.mapContainer).click(860, 320)
      cy.get(MAP.mapContainer).click(805, 203)
      cy.get(MAP.mapContainer).click(750, 320)

      cy.get(DRAWING.polygon).should('have.length', 2).and('be.visible')
      // Delete first polygon
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(DRAWING.buttonRemove).click()
      cy.get(DRAWING.polygon).should('have.length', 1).and('be.visible')
      cy.get(DRAWING.buttonDrawTool).first().click()
      cy.get(DRAWING.clusterSymbol).should('not.be.visible')
      cy.get(DRAWING.linkDrawresult).should('not.be.visible')
    })
    it('Should draw multiple lines on the map and delete one', () => {
      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.buttonDrawTool).eq(1).click()

      cy.get(MAP.mapContainer).click(514, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(DRAWING.tooltip).should('have.text', '489.02 m').and('be.visible')
      cy.get(DRAWING.polygon).should('have.css', 'stroke', 'rgb(0, 160, 60)')

      cy.get(DRAWING.buttonDrawTool).first().click()
      cy.get(DRAWING.polygon).should('not.be.visible')

      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.polygon).should('be.visible')
      cy.get(DRAWING.buttonDrawTool).eq(1).click()

      cy.get(MAP.mapContainer).click(514, 420)
      cy.get(MAP.mapContainer).click(660, 420)
      cy.get(MAP.mapContainer).click(660, 420)

      cy.get(DRAWING.polygon).should('have.length', 2).and('be.visible')
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(DRAWING.buttonRemove).click()
      cy.get(DRAWING.polygon).should('have.length', 1).and('be.visible')
      cy.get(DRAWING.buttonDrawTool).first().click()
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
      cy.server()
      cy.route('/dataselectie/bag/geolocation/*').as('getBagGeolocation')
      cy.route('/dataselectie/bag/?shape*').as('getBagShape')
      cy.route('/dataselectie/hr/geolocation/*').as('getHrGeoloaction')
      cy.route('/dataselectie/hr/?shape*').as('getHrShape')

      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.buttonDrawTool).eq(2).click()

      cy.get(MAP.mapContainer).click(514, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(MAP.mapContainer).click(573, 203)
      cy.get(MAP.mapContainer).click(514, 320)
      cy.wait('@getBagShape')
      cy.wait('@getBagGeolocation')
      cy.get(DRAWING.dropdownResults).select('Vestigingen')
      cy.wait('@getHrGeoloaction')
      cy.wait('@getHrShape')
      cy.get(DRAWING.linkDrawresult).should('have.length', 20)
      cy.contains('"Old Bridge" Souvenierwinkel')
      cy.get(DRAWING.clusterSymbol).should('be.visible').and('have.length', 3)
    })
    it('Should see kadastrale objecten', () => {
      cy.hidePopup()
      cy.visit('/kaart')
      cy.server()
      cy.route('/dataselectie/bag/geolocation/*').as('getBagGeolocation')
      cy.route('/dataselectie/bag/?shape*').as('getBagShape')
      cy.route('/dataselectie/brk/geolocation/*').as('getBrkGeoloaction')
      cy.route('/dataselectie/brk/kot/?shape*').as('getBrkShape')

      cy.get(MAP.mapContainer).should('exist').and('be.visible')
      cy.get(DRAWING.buttonDrawTool).click()
      cy.get(DRAWING.buttonDrawTool).eq(2).click()

      cy.get(MAP.mapContainer).click(514, 320)
      cy.get(MAP.mapContainer).click(660, 320)
      cy.get(MAP.mapContainer).click(573, 203)
      cy.get(MAP.mapContainer).click(514, 320)
      cy.wait('@getBagGeolocation')
      cy.wait('@getBagShape')
      cy.get(DRAWING.dropdownResults).select('Kadastrale objecten')
      cy.wait('@getBrkShape')
      cy.wait('@getBrkGeoloaction')
      cy.get(DRAWING.linkDrawresult).should('have.length', 20)
      cy.contains('ASD04 F 06476 G 0000')
    })
  })
})
