import { getCountFromHeader } from '../support/helper-functions';

describe('search module', () => {
  it('should show results when searching for "dam"', () => {
    cy.server();
    cy.defineSearchRoutes();

    cy.visit('/');

    cy.get('#auto-suggest__input').type('dam');
    // submit search form
    cy.get('.auto-suggest').submit();

    cy.waitForSearch(false);
    cy.get('h2').contains('Openbare ruimtes').then((title) => {
      expect(getCountFromHeader(title.text())).to.be.within(2, 10);
    });
    cy.get('h2').contains('Adressen').then((title) => {
      expect(getCountFromHeader(title.text())).to.be.within(250, 450);
    });
    cy.get('h2').contains('Monumenten').then((title) => {
      expect(getCountFromHeader(title.text())).to.be.within(10, 100);
    });
    cy.get('h2').contains('Adressen').parent().parent().find('.c-show-more').click();
    cy.get('li').contains('nevenadres').should('exist').and('be.visible');
    cy.get('li').contains('verblijfsobject gevormd').should('exist').and('be.visible');
  });
});
