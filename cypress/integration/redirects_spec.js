describe('redirects', () => {
  beforeEach(() => {
    cy.intercept('**/jsonapi/node/special/*').as('getSpecial')
  })
  it('should open the corona monitor', () => {
    cy.visit('/coronamonitor')
    cy.wait('@getSpecial')
    cy.url().should('include', '/specials/dashboard/dashboard-corona/')
    cy.get('iframe').should('be.visible')
  })
  it('should open the schoolloopbanen monitor', () => {
    cy.visit('/schoolloopbanen')
    cy.wait('@getSpecial')
    cy.url().should('include', '/specials/dashboard/dashboard-schoolloopbanen/')
    cy.get('iframe').should('be.visible')
  })
})
