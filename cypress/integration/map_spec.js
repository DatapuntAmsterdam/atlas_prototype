/* eslint-disable */
describe.skip('map module', () => {
  describe('user should be able to navigate to the map from the homepage', () => {
    it('should open the map', () => {
      // go to the homepage
      cy.visit('http://localhost:8080/');
      // check if the link is in the dom and visible
      cy.get('.qa-map-link').should('exist').and('be.visible');
      // the map should not exist yet
      cy.get('.c-map').should('not.exist');
      // click on the link to go to the map
      cy.get('.qa-map-link').click();
      // the homepage should not be visible anymore
      cy.get('.c-homepage').should('not.be.visible');
      // the map should be visible
      cy.get('.c-map').should('exist').and('be.visible');
    });
  });

  describe('user should be able to use the map', () => {
    it('should render the leaflet map', () => {
      // route to the map by url
      cy.visit('http://localhost:8080/#?mpb=topografie');
      // the map container should exist
      cy.get('.c-map').should('exist').and('be.visible');
      // the leaflet map should exist
      cy.get('.s-leaflet-draw').should('exist').and('be.visible');
      // the leaflet map should exist and should contain img
      cy.get('.leaflet-tile-container').find('img').should('exist').and('be.visible');
    });

    it('should add a map-layer to the leaflet map', () => {
      // route to the map
      cy.visit('http://localhost:8080/#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T');
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
      cy.visit('http://localhost:8080/#?mpb=topografie');
      // the map-panel should have the class collapsed
      cy.get('.map-panel').should('have.class', 'map-panel--collapsed');
      // the scroll wrapper should not be visible when map panel is collapsed
      cy.get('.scroll-wrapper').should('not.be.visible');
      // expand the map-panel
      cy.get('.map-panel__toggle').click();
      // the map panel should have the class expanded
      cy.get('.map-panel').should('have.class', 'map-panel--expanded');
      // the scroll wrapper should be visible when map panel is expanded
      cy.get('.scroll-wrapper').should('exist').and('be.visible');
    });
  });
});
