export {} // indicate that this is a module

declare global {
  // eslint-disable-next-line no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      defineGeoSearchRoutes(): void
      defineAddressDetailRoutes(): void
      waitForGeoSearch(): void
      waitForAdressDetail(): void
    }
  }
}

Cypress.Commands.add('defineGeoSearchRoutes', () => {
  cy.intercept('**/geosearch/bag/*').as('getGeoSearchBag')
  cy.intercept('**/geosearch/bekendmakingen/*').as('getGeoSearchBekendmakingen')
  cy.intercept('**/geosearch/biz/*').as('getGeoSearchBiz')
  cy.intercept('**/geosearch/bominslag/*').as('getGeoSearchBominslag')
  cy.intercept('**/geosearch/evenementen/*').as('getGeoSearchEvenementen')
  cy.intercept('**/geosearch/monumenten/*').as('getGeoSearchMonumenten')
  cy.intercept('**/geosearch/munitie/*').as('getGeoSearchMunitie')
  cy.intercept('**/geosearch/nap/*').as('getGeoSearchNap')
  cy.intercept('**/geosearch/oplaadpunten/*').as('getGeoSearchOplaadpunten')
  cy.intercept('**/geosearch/reclamebelasting/*').as('getGeoSearchReclamebelasting')
  cy.intercept('**/geosearch/winkgeb/*').as('getGeoSearchWinkelgebied')
})

Cypress.Commands.add('defineAddressDetailRoutes', () => {
  cy.intercept('**/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
  cy.intercept('**/bag/v1.1/verblijfsobject/*').as('getVerblijfsobject')
  cy.intercept('**/bag/v1.1/pand/?verblijfsobjecten__id=*').as('getPanden')
  cy.intercept('**/brk/object/?verblijfsobjecten__id=*').as('getObject')
  cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
  cy.intercept('**/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getSitueringen')
  cy.intercept('**/monumenten/monumenten/*').as('getMonument')
  cy.intercept('**/bouwdossier/*').as('getBouwdossier')
})

Cypress.Commands.add('waitForGeoSearch', () => {
  cy.wait('@getGeoSearchBag')
  cy.wait('@getGeoSearchBekendmakingen')
  cy.wait('@getGeoSearchBiz')
  cy.wait('@getGeoSearchBominslag')
  cy.wait('@getGeoSearchEvenementen')
  cy.wait('@getGeoSearchMonumenten')
  cy.wait('@getGeoSearchMunitie')
  cy.wait('@getGeoSearchNap')
  cy.wait('@getGeoSearchOplaadpunten')
  cy.wait('@getGeoSearchReclamebelasting')
  cy.wait('@getGeoSearchWinkelgebied')
})

Cypress.Commands.add('waitForAdressDetail', () => {
  cy.wait('@getNummeraanduiding')
  cy.wait('@getVerblijfsobject')
  cy.wait('@getPanden')
  cy.wait('@getObject')
  cy.wait('@getPanorama')
  cy.wait('@getSitueringen')
  cy.wait('@getBouwdossier')
})
