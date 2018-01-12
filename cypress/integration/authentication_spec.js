/* eslint-disable */
import { login, logout } from '../services/authentication';

describe('auth module', () => {
  describe('authentication', () => {
    it('should be verified', () => {
      login();
      cy.get('.qa-menu__title').should('contain', 'atlas.emp...');
      logout();
    });
  });
});
