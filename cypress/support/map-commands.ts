import { MAP } from './selectors'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      checkAerialPhotos(): void
      checkTopography(): void
      checkMapLayerCategory(category: string, categoryTestId?: string): void
      checkMapLayer(layerName: string, checkboxId: string, amountOfLayers: number): void
    }
  }
}

Cypress.Commands.add('checkAerialPhotos', () => {
  const aerial = [
    'Luchtfoto 2020',
    'Infrarood 2020',
    'Luchtfoto 2019',
    'Luchtfoto 2018',
    'Infrarood 2018',
    'Luchtfoto 2017',
    'Luchtfoto 2016',
    'Luchtfoto 2015',
    'Luchtfoto 2014',
    'Luchtfoto 2013',
    'Luchtfoto 2012',
    'Luchtfoto 2011',
    'Luchtfoto 2010',
    'Luchtfoto 2009',
    'Luchtfoto 2008',
    'Luchtfoto 2007',
    'Luchtfoto 2006',
    'Luchtfoto 2005',
    'Luchtfoto 2004',
    'Luchtfoto 2003',
  ]
  cy.get(MAP.dropDownLuchtfoto)
    .find('li')
    .each(($div, i) => {
      expect($div).to.have.text(aerial[i])
    })
})

Cypress.Commands.add('checkTopography', () => {
  const topograhy = ['Topografie', 'Topografie licht', 'Topografie grijs']
  cy.get(MAP.dropDownTopografie)
    .find('li')
    .each(($div, i) => {
      expect($div).to.have.text(topograhy[i])
    })
})

Cypress.Commands.add('checkMapLayerCategory', (category: string, categoryTestId?: string) => {
  cy.get(MAP.mapContainer).should('be.visible')
  cy.get(MAP.mapLegend).should('not.exist')

  cy.get(`[data-testid="mapLegendLayerButton${categoryTestId || category}"]`)
    .contains(category)
    .parents(MAP.mapLegendItemButton)
    .click('right')

  cy.get(MAP.mapZoomIn).click()
  cy.get(MAP.imageLayer).should('not.exist')
})

Cypress.Commands.add('checkMapLayer', (layerName, checkboxId, amountOfLayers) => {
  cy.get(MAP.mapLegendLayer)
    .find(MAP.mapLegendLabel)
    .contains(layerName)
    .scrollIntoView()
    .should('be.visible')
    .siblings(MAP.mapLegendCheckbox)
    .find(checkboxId)
    .check()
    .should('be.checked')

  cy.get(MAP.imageLayer).should('exist').and('have.length', amountOfLayers)
})
