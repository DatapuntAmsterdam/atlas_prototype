Cypress.Commands.add('defineGeoSearchRoutes', () => {
  cy.route('/geosearch/bag/*').as('getGeoSearchBag')
  cy.route('/geosearch/bekendmakingen/*').as('getGeoSearchBekendmakingen')
  cy.route('/geosearch/biz/*').as('getGeoSearchBiz')
  cy.route('/geosearch/bominslag/*').as('getGeoSearchBominslag')
  cy.route('/geosearch/evenementen/*').as('getGeoSearchEvenementen')
  cy.route('/geosearch/monumenten/*').as('getGeoSearchMonumenten')
  cy.route('/geosearch/munitie/*').as('getGeoSearchMunitie')
  cy.route('/geosearch/nap/*').as('getGeoSearchNap')
  cy.route('/geosearch/oplaadpunten/*').as('getGeoSearchOplaadpunten')
  cy.route('/parkeervakken/geosearch/*').as('getGeoSearchParkeervak')
  cy.route('/geosearch/reclamebelasting/*').as('getGeoSearchReclamebelasting')
  cy.route('/geosearch/winkgeb/*').as('getGeoSearchWinkelgebied')
})

Cypress.Commands.add('defineAddressDetailRoutes', () => {
  cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
  cy.route('/bag/v1.1/verblijfsobject/*').as('getVerblijfsobject')
  cy.route('/bag/v1.1/pand/?verblijfsobjecten__id=*').as('getPanden')
  cy.route('/brk/object-expand/?verblijfsobjecten__id=*').as('getObjectExpand')
  cy.route('/panorama/thumbnail/*').as('getPanorama')
  cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getSitueringen')
  cy.route('/monumenten/monumenten/*').as('getMonument')
  cy.route('*/bouwdossier/*').as('getBouwdossier')
})

Cypress.Commands.add('defineSearchRoutes', () => {
  cy.route('/atlas/search/adres/?q=*').as('getSearchAddressResults')
  cy.route('/atlas/search/gebied/?q=*').as('getSearchGebiedResults')
  cy.route('/atlas/search/kadastraalobject/?q=*').as('getSearchKadastraalObjectResults')
  cy.route('/atlas/search/kadastraalsubject/?q=*').as('getSearchKadastraalSubjectResults')
  cy.route('/atlas/search/openbareruimte/?q=*').as('getSearchOpenbareRuimteResults')
  cy.route('/dcatd/datasets*').as('getSearchCatalogueResults')
  cy.route('/handelsregister/search/maatschappelijkeactiviteit/?q=*').as(
    'getSearchMaatschappelijkeActiviteitResults',
  )
  cy.route('/handelsregister/search/vestiging/?q=*').as('getSearchVestigingResults')
  cy.route('/meetbouten/search/?q=*').as('getSearchMeetboutenResults')
  cy.route('/monumenten/search/?q=*').as('getSearchMonumentsResults')
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
  cy.wait('@getGeoSearchParkeervak')
  cy.wait('@getGeoSearchReclamebelasting')
  cy.wait('@getGeoSearchWinkelgebied')
})

Cypress.Commands.add('waitForAdressDetail', () => {
  cy.wait('@getNummeraanduiding')
  cy.wait('@getVerblijfsobject')
  cy.wait('@getPanden')
  cy.wait('@getObjectExpand')
  cy.wait('@getPanorama')
  cy.wait('@getSitueringen')
  cy.wait('@getMonument')
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
