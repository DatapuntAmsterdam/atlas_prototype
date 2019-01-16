describe('content module', () => {
  describe('user should be able to navigate to the content from the homepage', () => {
    it('should open `Bediening` content', () => {
      // go to the homepage
      cy.visit('/');
      // scroll to div containing the content
      cy.get('.c-homepage__news').should('exist').scrollIntoView().and('be.visible');
      // check if the link is in the dom and visible
      cy.get('.qa-btn--link').contains('Bediening').should('exist').and('be.visible');
      // click to go to the content
      cy.get('.qa-btn--link').contains('Bediening').click();
      // the correct content should exist and be visible
      cy.get('p').contains('Het dataportaal biedt verschillende mogelijkheden').should('exist').and('be.visible');
    });
  });
});
