import { ADDRESS_PAGE, DATA_SEARCH, PRINT } from '../support/selectors'

describe('print module', () => {
  beforeEach(() => {
    cy.server()
    cy.route('/typeahead?q=10581111').as('getTypeAhead')
    cy.route('/meetbouten/meetbout/*').as('getResults')
    cy.route('/meetbouten/meting/?meetbout=*').as('getMeeting')
    cy.route('/panorama/thumbnail/?*').as('getPanoThumbnail')
    cy.route('/jsonapi/node/list/**').as('jsonapi')

    cy.hidePopup()

    cy.visit('/')

    cy.wait('@jsonapi')
  })
  it('should show a print version of the page when the user click on the print button', () => {
    cy.get(DATA_SEARCH.autoSuggestInput).type('10581111')
    cy.wait('@getTypeAhead')
    cy.get(DATA_SEARCH.autoSuggest).contains('10581111').click()

    cy.wait('@getResults')
    cy.wait('@getMeeting')
    cy.wait('@getPanoThumbnail')
    cy.get(ADDRESS_PAGE.panoramaThumbnail).should('exist').and('be.visible')
    cy.get(ADDRESS_PAGE.resultsPanelTitle).should('exist').and('be.visible').contains('10581111')

    cy.get(PRINT.printLink).first().should('exist').click()
    cy.get(PRINT.headerTitle).should('exist').and('be.visible')
    cy.get(PRINT.buttonClosePrint).click()
    cy.get(PRINT.ßheaderTitle).should('not.exist').and('not.be.visible')
    cy.get(ADDRESS_PAGE.panoramaThumbnail).should('exist').and('be.visible')
    cy.get(ADDRESS_PAGE.resultsPanelTitle).should('exist').and('be.visible').contains('10581111')
  })
})
