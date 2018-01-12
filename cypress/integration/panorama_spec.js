/* eslint-disable */
describe('panorama module', () => {
  beforeEach(() => {
    // go to the homepage
    cy.visit('http://localhost:8080/');
    // check if the link is in the dom and visible
    cy.get('.qa-straatbeeld-link').should('exist').and('be.visible');
    // the map should not exist yet
    cy.get('.c-straatbeeld').should('not.exist');
    // click on the link to go to the map
    cy.get('.qa-straatbeeld-link').click();
  });

  describe('user should be able to navigate to the panoram from the homepage', () => {
    it('should open the panorama viewer', () => {
      // the homepage should not be visible anymore
      cy.get('.c-homepage').should('not.be.visible');
      // the map should be visible
      cy.get('.c-straatbeeld').should('exist').and('be.visible');
    });
  });

  describe('user should be able to use the panorama viewer', () => {
    it('should render the marzipano viewer', () => {
      // the canvas inside de marzipano viewer should exist and be visible
      cy.get('.js-marzipano-viewer').find('canvas').should('exist').and('be.visible');
    });

    it('should be able to click a hotspot and change the coordinates', () => {
      cy.get('.c-straatbeeld-status-bar__info-item').first()
      .then((coordinatesEl) => {
        const coordinates = coordinatesEl[0].innerText;
        // the click the first hotspot
        cy.get('.qa-hotspot-button:visible').first().click();
        // the coordinates should be different
        cy.get('.c-straatbeeld-status-bar__info-item').first().contains(coordinates).should('not.exist');
      });
    });
  });

  describe('user should be able to use the leaflet map', () => {
    it('should render the leaflet map and set the marker', () => {
      // the canvas inside de marzipano viewer should exist and be visible
      cy.get('.leaflet-marker-pane').find('img').should('exist').and('be.visible');
    });

    it('should set the panoramabeelden as active layers in the map-panel legenda', () => {
      // open the the map panel (closed initially)
      cy.get('.map-panel__toggle').click();
      // should contain the correct value
      cy.get('.map-legend__category-title').contains('Panoramabeelden').should('exist').and('be.visible');
    });

    it('should set the layers in the leaflet map', () => {
      // should contain the correct value
      cy.get('.leaflet-image-layer').should('exist').and('be.visible');
    });

    it('should change the coordinates when clicked on the map', () => {
      cy.get('.c-straatbeeld-status-bar__info-item').first()
      .then((coordinatesEl) => {
        const coordinates = coordinatesEl[0].innerText;
        // click on the leaflet map with a different position
        cy.get('.s-leaflet-draw').trigger('click', 20, 100);
        // the coordinates should be different
        cy.get('.c-straatbeeld-status-bar__info-item').first().contains(coordinates).should('not.exist');
      });
    });
  });
});
