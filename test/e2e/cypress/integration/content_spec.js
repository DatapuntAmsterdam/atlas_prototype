describe('content module', () => {
  describe('user should be able to navigate to the content from the homepage', () => {
    it('should open `Bediening` content', () => {
      // go to the homepage
      cy.visit('/');
      // check if the link is in the dom and visible
      cy.get('.qa-btn--link').contains('Bediening').should('exist').and('be.visible');
      // click to go to the content
      cy.get('.qa-btn--link').contains('Bediening').click();
      // the correct content should exist and be visible
      cy.get('p').contains('Het dataportaal biedt verschillende mogelijkheden').should('exist').and('be.visible');
    });
  });
});
