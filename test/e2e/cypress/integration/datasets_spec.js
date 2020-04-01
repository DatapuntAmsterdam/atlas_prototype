import { DATA_SETS } from '../support/selectors'

describe('datasets module', () => {
  describe('user should be able to navigate to the datasets catalogus from the homepage', () => {
    beforeEach(() => {
      cy.viewport('macbook-15')
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.hidePopup()

      cy.visit('/')

      cy.wait('@jsonapi')
      cy.get('h4').should('be.visible').and('contain', 'Datasets')
    })

    it('should open the datasets catalogus without a filter and see results', () => {
      cy.get('[data-test=navigation-block] > [href="/datasets/zoek/"]').should('be.visible').click()
      cy.url().should('include', '/datasets/zoek')

      cy.wait('@graphql')
      cy.wait('@graphql')

      cy.contains('Datasets (')

      // Check if there are 20 results shown
      cy.get(DATA_SETS.dataSetLink).should('have.length', 20).should('be.visible')
    })

    it('should open a dataset', () => {
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('[data-test=navigation-block] > [href="/datasets/zoek/"]').should('be.visible').click()

      cy.url().should('include', '/datasets/zoek')

      cy.wait('@graphql')
      cy.wait('@graphql')

      cy.contains('Datasets (')

      // Open first result
      cy.get(DATA_SETS.dataSetLink).first().click()

      // check detail titles
      cy.get('h3').should('be.visible').and('contain', 'Dataset')
      cy.get('h3').should('be.visible').and('contain', 'Resources')
      cy.get('h3').should('be.visible').and('contain', 'Details')
      cy.get('h3').should('be.visible').and('contain', "Thema's")
      cy.get('h3').should('be.visible').and('contain', 'Tags')
      cy.get('h3').should('be.visible').and('contain', 'Licentie')

      // as downloading is not testable, we check for the presence of href
      cy.get('.resources-item').should('exist').and('be.visible').and('have.attr', 'href')
    })

    it('should open the datasets catalogus with a filter and see filtered results', () => {
      cy.get('h1').should('contain', 'Zoek op thema').and('be.visible')

      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('a[href*="/zoek/"]:contains("Bestuur")').click()

      // check url on filter with theme
      cy.url().should('include', '/zoek/?filters=theme')
      cy.wait(['@graphql', '@graphql'])

      cy.contains('Categorieën').should('be.visible')
      cy.contains("Thema's").should('be.visible')
      cy.contains('Bestuur').should('be.visible')

      //  Check if checkbox is checked. Use css.escape because of : in id.
      cy.get(`#${CSS.escape('theme-theme:bestuur')}`).should('be.checked')
    })
  })
})
