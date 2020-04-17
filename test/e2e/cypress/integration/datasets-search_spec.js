import { DATA_SEARCH, SEARCH } from '../support/selectors'

describe('datasets search module', () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.logout()
  })

  describe('user should be able to search and see results', () => {
    beforeEach(() => {
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.hidePopup()

      cy.visit('/')
      cy.wait('@jsonapi')
    })

    it('should open the datasets results', () => {
      cy.get(SEARCH.input).trigger('focus')
      cy.get(SEARCH.input).type('Park')
      cy.get(DATA_SEARCH.autoSuggest).submit()
      cy.url().should('include', '/zoek/?term=Park')
      cy.wait(['@graphql', '@graphql'])

      // Check if datasets are visible
      cy.get('h2').should('be.visible').and('contain', 'Datasets')
    })

    it('should not open the datasets results because there are no results', () => {
      cy.get(SEARCH.input).trigger('focus')
      cy.get(SEARCH.input).type('NORESULTS')
      cy.get(DATA_SEARCH.autoSuggest).submit()
      cy.url().should('include', '/zoek/?term=NORESULTS')
      cy.wait(['@graphql', '@graphql'])

      // Check if datasets are NOT visible
      cy.contains('Datasets').should('not.be.visible')
    })
  })
})
