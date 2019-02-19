Cypress.Commands.add('defineGeoSearchRoutes', () => {
  cy.route('/geosearch/nap/*').as('getGeoSearchNap');
  cy.route('/geosearch/bag/*').as('getGeoSearchBag');
  cy.route('/geosearch/munitie/*').as('getGeoSearchMunitie');
  cy.route('/geosearch/bominslag/*').as('getGeoSearchBominslag');
  cy.route('/geosearch/monumenten/*').as('getGeoSearchMonumenten');
  cy.route('/geosearch/grondexploitatie/*').as('getGeoSearchGrondexploitatie');
  cy.route('/geosearch/biz/*').as('getGeoSearchBiz');
  cy.route('/parkeervakken/geosearch/*').as('getGeoSearchParkeervak');
  cy.route('/geosearch/oplaadpunten/*').as('getGeoSearchOplaadpunten');
});

Cypress.Commands.add('defineSearchRoutes', () => {
  cy.route('/atlas/search/adres/?q=*').as('getSearchAddressResults');
  cy.route('/atlas/search/gebied/?q=*').as('getSearchGebiedResults');
  cy.route('/atlas/search/kadastraalobject/?q=*').as('getSearchKadastraalObjectResults');
  cy.route('/atlas/search/kadastraalsubject/?q=*').as('getSearchKadastraalSubjectResults');
  cy.route('/atlas/search/openbareruimte/?q=*').as('getSearchOpenbareRuimteResults');
  cy.route('/dcatd/datasets*').as('getSearchCatalogueResults');
  cy.route('/handelsregister/search/maatschappelijkeactiviteit/?q=*').as('getSearchMaatschappelijkeActiviteitResults');
  cy.route('/handelsregister/search/vestiging/?q=*').as('getSearchVestigingResults');
  cy.route('/meetbouten/search/?q=*').as('getSearchMeetboutenResults');
  cy.route('/monumenten/search/?q=*').as('getSearchMonumentsResults');
});

Cypress.Commands.add('waitForGeoSearch', () => {
  cy.wait('@getGeoSearchNap');
  cy.wait('@getGeoSearchBag');
  cy.wait('@getGeoSearchMunitie');
  cy.wait('@getGeoSearchBominslag');
  cy.wait('@getGeoSearchMonumenten');
  cy.wait('@getGeoSearchGrondexploitatie');
  cy.wait('@getGeoSearchBiz');
  cy.wait('@getGeoSearchParkeervak');
  cy.wait('@getGeoSearchOplaadpunten');
});

Cypress.Commands.add('waitForSearch', (type = 'EMPLOYEE_PLUS') => {
  cy.wait('@getSearchAddressResults');
  cy.wait('@getSearchGebiedResults');
  cy.wait('@getSearchKadastraalObjectResults');
  cy.wait('@getSearchOpenbareRuimteResults');
  cy.wait('@getSearchCatalogueResults');
  cy.wait('@getSearchMeetboutenResults');
  cy.wait('@getSearchMonumentsResults');

  if (type === 'EMPLOYEE_PLUS' || type === 'EMPLOYEE') {
    cy.wait('@getSearchKadastraalSubjectResults');
    cy.wait('@getSearchMaatschappelijkeActiviteitResults');
    cy.wait('@getSearchVestigingResults');
  }
});
