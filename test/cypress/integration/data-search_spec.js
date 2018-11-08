describe('data search module', () => {
  before(() => {
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('user should see suggestions', () => {
    // open the autocomplete panel and select the first dataset option and route the correct address
    cy.server();

    cy.route('/typeahead?q=Dam').as('getResults');
    cy.route('/bag/openbareruimte/*').as('getItem');

    cy.visit('/');
    cy.get('#auto-suggest__input').focus().type('Dam');

    cy.wait('@getResults');
    cy.get('.auto-suggest').should('exist').and('be.visible');
    cy.get('h4').contains('Straatnamen').siblings('ul').children('li')
      .first()
      .children()
      .first()
      .then(($el) => {
        const firstValue = $el[0].innerText;
        cy.get('h4').contains('Straatnamen').siblings('ul').children('li').first().click();
        cy.wait('@getItem');
        cy.get('.o-header__title').contains(firstValue).should('exist').and('be.visible');
      });
  });


  it('should open the address detail ', () => {
    cy.server();
    cy.defineGeoSearchRoutes();

    // Use regular expressions in the route to match the spaces
    cy.route(/\/typeahead\?q=Ad Windighof 2/).as('getResults');
    cy.route('/bag/verblijfsobject/*').as('getVerblijfsobject');
    cy.route('/bag/pand/*').as('getPand');
    cy.route('/monumenten/monumenten/*').as('getMonumenten');
    cy.route('/handelsregister/vestiging/*').as('getVestiging');
    cy.route('/panorama/thumbnail/*').as('getPanoThumbnail');
    cy.route('/bag/nummeraanduiding/*').as('getNummeraanduiding');

    // ensure the viewport is always the same in this test, so the clicks can be aligned properly
    cy.viewport(1000, 660);
    cy.visit('/');
    // type in search and click on autosuggest item
    cy.get('#auto-suggest__input').focus().type('Ad Windighof 2');

    cy.wait('@getResults');
    cy.get('.auto-suggest').contains('Ad Windighof 2').click();

    // check that the large right column is visible and shows the correct data
    cy.wait('@getVerblijfsobject');
    cy.get('.qa-dashboard__column--right').should('exist').and('be.visible');
    cy.get('.qa-dashboard__column--right').get('.qa-title span')
      .contains('Ad Windighof 2')
      .and('have.css', 'font-style')
      .and('match', /normal/);
    cy.get('.qa-dashboard__column--right').get('dl').contains('1087HE');

    cy.wait('@getPanoThumbnail');
    cy.get('.qa-dashboard__column--right')
      .get('img.c-straatbeeld-thumbnail--img')
      .should('exist').and('be.visible');

    // click in map (there is a marker on this position)
    cy.get('.qa-map-container').click(166, 304);

    // check that the address is open in right column
    cy.waitForGeoSearch();
    cy.get('.c-search-results__block-content')
      .contains('Ad Windighof 2')
      .should('exist').and('be.visible');
  });

  describe('user should be able to submit', () => {
    beforeEach(() => {
      cy.server();
      cy.defineSearchRoutes();
      cy.visit('/');
      cy.get('.auto-suggest__input').trigger('focus');
    });

    it('should submit the search and give results', () => {
      cy.get('.auto-suggest__input').type('Park');
      cy.get('.auto-suggest').submit();
      cy.waitForSearch();
      cy.get('.o-list').should('exist').and('be.visible');
    });

    it('should submit the search and give no results', () => {
      cy.get('.auto-suggest__input').type('NORESULTS');
      cy.get('.auto-suggest').submit();
      cy.waitForSearch();
      cy.get('.o-list').should('have.length', 0);
    });
  });
});
