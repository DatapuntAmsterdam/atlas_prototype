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

Cypress.Commands.add('defineSearchRoutes', () => {
  cy.intercept('**/atlas/search/adres/?q=*').as('getSearchAddressResults')
  cy.intercept('**/atlas/search/gebied/?q=*').as('getSearchGebiedResults')
  cy.intercept('**/atlas/search/kadastraalobject/?q=*').as('getSearchKadastraalObjectResults')
  cy.intercept('**/atlas/search/kadastraalsubject/?q=*').as('getSearchKadastraalSubjectResults')
  cy.intercept('**/atlas/search/openbareruimte/?q=*').as('getSearchOpenbareRuimteResults')
  cy.intercept('**/dcatd/datasets*').as('getSearchCatalogueResults')
  cy.intercept('**/handelsregister/search/maatschappelijkeactiviteit/?q=*').as(
    'getSearchMaatschappelijkeActiviteitResults',
  )
  cy.intercept('**/handelsregister/search/vestiging/?q=*').as('getSearchVestigingResults')
  cy.intercept('**/meetbouten/search/?q=*').as('getSearchMeetboutenResults')
  cy.intercept('**/monumenten/search/?q=*').as('getSearchMonumentsResults')
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

Cypress.Commands.add('waitForSearch', (type = 'EMPLOYEE_PLUS') => {
  cy.wait('@getSearchAddressResults')
  cy.wait('@getSearchGebiedResults')
  cy.wait('@getSearchKadastraalObjectResults')
  cy.wait('@getSearchOpenbareRuimteResults')
  cy.wait('@getSearchCatalogueResults')
  cy.wait('@getSearchMeetboutenResults')
  cy.wait('@getSearchMonumentsResults')

  if (type === 'EMPLOYEE_PLUS' || type === 'EMPLOYEE') {
    cy.wait('@getSearchKadastraalSubjectResults')
    cy.wait('@getSearchMaatschappelijkeActiviteitResults')
    cy.wait('@getSearchVestigingResults')
  }
})
Cypress.Commands.add('stubResponse', (url, fixture) => {
  cy.intercept(url, {
    headers: {
      'access-control-allow-origin': window.location.origin,
      'Access-Control-Allow-Credentials': 'true',
    },
    fixture: `${fixture}`,
  })
})
