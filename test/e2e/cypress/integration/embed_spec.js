const checkbox = 'input[type="checkbox"]';
const header = 'header';

describe('embed module', () => {
  beforeEach(() => {
    // go to the homepage
    cy.visit('/');
  });

  it('should show the user the embed view of the map', () => {
    cy.visit('/kaart?lagen=YmdlbToxfGtnZW06MXxrc2VjOjF8a290OjE%3D&locatie=52.37732239072315%2C4.895808658950058&zoom=14');
    cy.get(header).should('exist');
    cy.get(checkbox).should('exist').and('be.visible');

    cy.visit('/kaart?lagen=YmdlbToxfGtnZW06MXxrc2VjOjF8a290OjE%3D&locatie=52.37732239072315%2C4.895808658950058&zoom=14&embed=true');
    cy.get(header).should('not.exist');
    cy.get('.c-embed-button').contains('City Data').should('exist').and('be.visible');
    // this link has 3 layers active
    cy.get('h4.map-legend__category-title').then((titles) => {
      expect(titles.length).to.eq(3);
    });
    // the user should not be able to toggle map layers
    cy.get(checkbox).should('not.be.visible');
  });
});
