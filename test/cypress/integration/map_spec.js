const columnRight = '.qa-dashboard__column--right';
const homepage = '.c-homepage';
const map = '.c-map';
const notification = '.map-legend__notification';
const scrollWrapper = '.scroll-wrapper';

describe('map module', () => {
  describe('user should be able to navigate to the map from the homepage', () => {
    it('should open the map', () => {
      // go to the homepage
      cy.visit('/');
      // the homepage should be visible
      cy.get(homepage).should('be.visible');
      // check if the link is in the dom and visible
      cy.get('.qa-map-link').should('exist').and('be.visible');
      // the map should not exist yet
      cy.get(map).should('not.exist');
      // click on the link to go to the map
      cy.get('.qa-map-link').click();
      // the homepage should not be visible anymore
      cy.get(homepage).should('not.be.visible');
      // the map should be visible
      cy.get(map).should('exist').and('be.visible');
    });
  });

  describe('user should be able to interact with the map', () => {
    it('should show results based on the interaction with the map', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.route('/bag/nummeraanduiding/*').as('getNummeraanduiding');
      cy.route('/bag/verblijfsobject/*').as('getVerblijfsobject');
      cy.route('/panorama/thumbnail/*').as('getPanoThumbnail');
      cy.route('/monumenten/monumenten/*').as('getMonumenten');

      // Use regular expression to match spaces
      cy.route(/\/typeahead\?q=dam 1/).as('getTypeaheadResults');

      // ensure the viewport is always the same in this test, so the clicks can be aligned properly
      cy.viewport(1000, 660);
      cy.visit('/');

      cy.get('.qa-map-link').click();
      cy.get('#auto-suggest__input').focus().type('dam 1');

      cy.wait('@getTypeaheadResults');
      cy.get('.auto-suggest').contains('Dam 1').click();

      cy.wait('@getVerblijfsobject');
      // check that the circle icon is drawed on the map
      cy.get('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive')
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'src', 'assets/images/map/detail.svg');
      cy.checkPreviewPanel(['Dam 1', 'winkelfunctie']);

      // click somewhere in the map (not on a marker)
      cy.get('.qa-map-container').click(560, 293);

      cy.waitForGeoSearch();
      // check that the search icon is drawn on the map
      cy.get('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive')
        .should('exist').and('be.visible')
        .and('have.attr', 'src', 'assets/images/map/search.svg');

      cy.wait('@getMonumenten');
      cy.wait('@getNummeraanduiding');
      cy.get('.map-preview-panel.map-preview-panel--visible').contains('Beursplein 15').click();

      cy.wait('@getMonumenten');
      cy.wait('@getNummeraanduiding');

      cy.get('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive')
        .should('exist').and('be.visible')
        .and('have.attr', 'src', 'assets/images/map/detail.svg');
      cy.get('.map-preview-panel.map-preview-panel--visible')
        .get('img.map-detail-result__header-pano')
        .should('exist').and('be.visible');
      cy.checkPreviewPanel(['Indicatie hoofdadres', 'Nee']);

      // click on the button inside the panel balloon thingy, and expect the large right column to
      // become visible
      cy.get('button.map-preview-panel__button[title="Volledige weergave tonen"]').click();
      cy.get(columnRight).should('exist').and('be.visible');
      cy.get(columnRight).get('.qa-title').contains('Beursplein 15');
      cy.get(columnRight).get('dl').contains('1012JW');
      cy.wait('@getPanoThumbnail');
      cy.get(columnRight)
        .get('img.c-straatbeeld-thumbnail--img')
        .should('exist').and('be.visible');
    });

    it('should remember the state when navigating back', () => {
      cy.server();
      cy.route('/geosearch/search/?*').as('getSearchResults');
      cy.route('/meetbouten/meetbout/*').as('getMeetbout');
      cy.route('/panorama/thumbnail/*').as('getPanoThumbnail');
      // ensure the viewport is always the same in this test, so the clicks can be aligned properly
      cy.viewport(1000, 660);

      cy.visit('/#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3728007:4.899258&pgn=home&uvm=T');
      cy.get('.map-layers__category').contains('Meetbouten - Zaksnelheid').click();
      cy.get(notification)
        .contains('Zichtbaar bij verder inzoomen')
        .and('is.visible');
      cy.get('.leaflet-control-zoom-in').click();

      // wait for the second click
      cy.wait(250);
      cy.get('.leaflet-control-zoom-in').click();
      cy.get(notification).should('not.be.visible');
      cy.get('.map-legend__items').should('exist').and('be.visible');

      // click on the map
      cy.wait(250);
      cy.get('.qa-map-container').click(702, 517);

      cy.wait('@getSearchResults');
      cy.wait('@getMeetbout');
      cy.checkPreviewPanel(['Nieuwmarkt 25', '10581111']);

      cy.get('button.map-search-results__button').click();

      cy.wait('@getPanoThumbnail');
      cy.get(columnRight).should('exist').and('be.visible');
      cy.get(columnRight).get('.qa-title').contains('10581111');
      cy.get(columnRight).get('dl').contains('Nieuwmarkt 25');
      cy.get(columnRight)
        .get('img.c-straatbeeld-thumbnail--img')
        .should('exist').and('be.visible');

      cy.get('button.toggle-fullscreen').click();

      cy.get(columnRight).should('exist').and('not.be.visible');
      cy.get('.map-preview-panel.map-preview-panel--visible')
        .get('img.map-detail-result__header-pano')
        .should('exist').and('be.visible');
      cy.checkPreviewPanel(['Nieuwmarkt 25', '10581111']);

      cy.go('back');

      cy.get(columnRight).should('exist').and('be.visible');
      cy.get(columnRight).get('.qa-title').contains('10581111');
      cy.get(columnRight).get('dl').contains('Nieuwmarkt 25');
      cy.get(columnRight)
        .get('img.c-straatbeeld-thumbnail--img')
        .should('exist').and('be.visible');

      cy.go('back');

      cy.get(columnRight).should('exist').and('not.be.visible');
      cy.get('.map-preview-panel.map-preview-panel--visible')
        .get('img.map-detail-result__header-pano')
        .should('exist').and('be.visible');
      cy.checkPreviewPanel(['Nieuwmarkt 25', '10581111']);
    });
  });

  describe('user should be able to use the map', () => {
    it('should render the leaflet map', () => {
      // route to the map by url
      cy.visit('/#?mpb=topografie');
      // the map container should exist
      cy.get(map).should('exist').and('be.visible');
      // the leaflet map should exist
      cy.get('.leaflet-container').should('exist').and('be.visible');
      // the leaflet map should exist and should contain img
      cy.get('.leaflet-tile-container').find('img').should('exist').and('be.visible');
    });

    it('should add a map-layer to the leaflet map', () => {
      // route to the map
      cy.visit('/#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T');
      // get the first map-layer button
      cy.get('.map-layers__title').first().click();
      // check if the map has overlay panes
      cy.get('.leaflet-overlay-pane').children().should('exist');
      // check if there is a canvas element inside the first overlay pane
      cy.get('.leaflet-overlay-pane').find('canvas').should('exist');
    });
  });

  describe('user should be able to open the map panel when collapsed', () => {
    it('should add open the map panel component', () => {
      // route to the map
      cy.visit('/#?mpb=topografie');
      // the map-panel should have the class collapsed
      cy.get('.map-panel').should('have.class', 'map-panel--collapsed');
      // the scroll wrapper should not be visible when map panel is collapsed
      cy.get(scrollWrapper).should('not.be.visible');
      // expand the map-panel
      cy.get('.map-panel__toggle').click();
      // the map panel should have the class expanded
      cy.get('.map-panel').should('have.class', 'map-panel--expanded');
      // the scroll wrapper should be visible when map panel is expanded
      cy.get(scrollWrapper).should('exist').and('be.visible');
    });
  });
});
