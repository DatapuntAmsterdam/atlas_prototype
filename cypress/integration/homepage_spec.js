/* eslint-disable */
import { login, logout } from '../services/authentication';

describe('the home page', () => {
  describe('can navigate to the map w/ layer selection opened', () => {
    it('close layer selection, then close the map and then it returns to the homepage', () => {
      cy.visit('http://localhost:8080');

      cy.get('.c-homepage').should('exist').and('be.visible');
      cy.get('.qa-layer-selection').should('not.exist');
      cy.get('.qa-map').should('not.exist');

      // Go to the map
      cy.get('.qa-map-link').click();

      cy.get('.c-homepage').should('not.be.visible');
      cy.get('.map-panel').should('exist').and('be.visible');
    });
  });

  describe('authentication', () => {
    it('should be verified', () => {
      login();
      cy.get('.qa-menu__title').should('contain', 'atlas.emp...');
      logout();
    });
  });
});
