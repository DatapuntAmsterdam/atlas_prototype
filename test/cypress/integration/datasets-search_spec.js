/* eslint-disable */
import { login, logout } from '../services/authentication';
describe('datasets search module', () => {
  before(() => {
    login();
  });

  after(() => {
    logout();
  });

  describe('user should be to type and see suggestions', () => {
    it('should open the autocomplete panel', () => {
      cy.visit('/');
      cy.get('input.js-search-input').trigger('focus');
      cy.get('input.js-search-input').type('Park');
      cy.get('input.js-search-input').trigger('change');
      cy.get('.c-autocomplete').should('exist').and('be.visible');
    });
  });

  describe('user should be able to search and see results', () => {
    it('should open the datasets results', () => {
      cy.server()
      cy.route('https://acc.api.data.amsterdam.nl/catalogus/api/3/action/*').as('getResults')
      cy.visit('/');
      cy.get('input.js-search-input').trigger('focus');
      cy.get('input.js-search-input').type('Park');
      cy.get('.c-search-form').submit();
      cy.wait('@getResults');
      cy.get('.o-tabs__tab--link').contains('Datasets').click();
      cy.get('.c-data-selection-card').should('exist').and('be.visible');
    });

    it('should not open the datasets results because there are no results', () => {
      cy.server()
      cy.route('https://acc.api.data.amsterdam.nl/catalogus/api/3/action/*').as('getResults')
      cy.visit('/');
      cy.get('input.js-search-input').trigger('focus');
      cy.get('input.js-search-input').type('NORESULTS');
      cy.get('.c-search-form').submit();
      cy.wait('@getResults');
      cy.get('.o-tabs__tab--link').should('not.exist').and('not.be.visible');
      cy.get('.c-data-selection-card').should('not.exist').and('not.be.visible');
    });
  });
});
