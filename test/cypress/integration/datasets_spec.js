/* eslint-disable */
describe('datasets module', () => {
  describe('user should be able to navigate to the datasets catalogus from the homepage', () => {
    beforeEach(() => {
      // go to the homepage
      cy.visit('/');
      // check if the link is in the dom and visible
      cy.get('.c-homepage__block--datasets').should('exist').and('be.visible');
      // the datasets component should not exist yet
      cy.get('.c-data-selection').should('not.exist');
    });

    it('should open the datasets catalogus without a filter and see results', () => {
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('.c-homepage__block--datasets').find('.qa-dp-link').click();
      // the homepage should not be visible anymore
      cy.get('.c-homepage').should('not.be.visible');
      // the data selection should be visible
      cy.get('.c-data-selection').should('exist').and('be.visible');
      // the title should contain Datasets
      cy.get('h1').contains('Datasets').should('exist').and('be.visible');
      // the datasets filters should not exist
      cy.get('.c-data-selection-active-filters').should('not.exist').and('not.be.visible');
      // at least one results should exist
      cy.get('.c-data-selection-card').should('exist').and('be.visible');
    });

    it('should open the datasets catalogus with a filter and see filtered results', () => {
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('.c-homepage__block--datasets').find('.c-catalogus-theme__icon--kaart').click();
      // the homepage should not be visible anymore
      cy.get('.c-homepage').should('not.be.visible');
      // the datasets component should be visible
      cy.get('.c-data-selection').should('exist').and('be.visible');
      // the title should contain Datasets
      cy.get('h1').contains('Datasets').should('exist').and('be.visible');
      // the datasets filters should exist
      cy.get('.c-data-selection-active-filters').should('exist').and('be.visible');
      // at least one results should exist
      cy.get('.c-data-selection-card').should('exist').and('be.visible');
    });
  });
});
