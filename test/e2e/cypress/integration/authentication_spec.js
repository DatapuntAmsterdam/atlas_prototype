import { HEADER_MENU } from '../support/selectors'

describe('auth module', () => {
  describe('authentication', () => {
    it('should be verified', () => {
      cy.login()
      cy.get(HEADER_MENU.rootMobile)
        .click()
        .get(`${HEADER_MENU.rootMobile} ${HEADER_MENU.login}`)
        .contains('n.druif@a...')
      cy.logout()
    })
  })
})
