/* eslint-disable */
import { login, logout } from '../services/authentication';
describe('data search module', () => {
  before(() => {
    login();
  });

  after(() => {
    logout();
  });

  it('user should see suggestions', () => {
    // open the autocomplete panel and select the first dataset option and route the correct address
    cy.visit('/');
    cy.get('input.js-search-input').trigger('focus');
    cy.get('input.js-search-input').type('Park');
    cy.get('input.js-search-input').trigger('change');
    cy.get('.c-autocomplete').should('exist').and('be.visible');
    cy.get('h4').contains('Straatnamen').siblings('ul').children('li').first().children().first()
    .then(($el) => {
      const firstValue = $el[0].innerText;
      cy.get('h4').contains('Straatnamen').siblings('ul').children('li').first().click();
      cy.get('.o-header__title').contains(firstValue).should('exist').and('be.visible');
    });
  });

  describe('user should be able to submit', () => {
    beforeEach(() => {
      cy.server()
      cy.route('https://acc.api.data.amsterdam.nl/catalogus/api/3/action/*').as('getResults')
      cy.visit('/');
      cy.get('input.js-search-input').trigger('focus');
    });

    it('should submit the search and give results', () => {
      cy.get('input.js-search-input').type('Park');
      cy.get('.c-search-form').submit();
      cy.wait('@getResults');
      cy.get('.o-list').should('exist').and('be.visible')
    });

    it('should submit the search and give no results', () => {
      cy.get('input.js-search-input').type('NORESULTS');
      cy.get('.c-search-form').submit();
      cy.wait('@getResults');
      cy.get('.o-list').should('have.length', 0);
    });
  });
});
