describe('popup', () => {
  it('should be able to close when popped up', () => {
    cy.server()
    cy.route('/sockjs-node/info?t=*').as('notification')
    cy.visit('/')
    cy.wait('@notification')
    cy.wait(500)
    cy.get('body').then((body) => {
      const element = '[role="dialog"] button'
      if (body.find(element).length > 0) {
        cy.get(element).click()
      }
    })
  })
})
