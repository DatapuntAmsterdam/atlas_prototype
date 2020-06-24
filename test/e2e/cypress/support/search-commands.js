import { DATA_SEARCH } from './selectors'

Cypress.Commands.add('checkAutoSuggestFirstOfAll', (searchTerm, result) => {
  cy.server()
  cy.route('POST', '/cms_search/graphql/').as('postGraphql')
  cy.route(`/typeahead?q=${searchTerm.toLowerCase()}`).as('getTypeAhead')
  cy.get(DATA_SEARCH.autoSuggest).type(searchTerm)
  cy.wait('@getTypeAhead')
  cy.get(DATA_SEARCH.autoSuggestDropDownItem).first().should('have.text', result)
  cy.get(DATA_SEARCH.buttonSearch).click()
  cy.wait('@postGraphql')
})

Cypress.Commands.add('checkAutoSuggestFirstofCategory', (searchTerm, category, result) => {
  cy.server()
  cy.route('POST', '/cms_search/graphql/').as('postGraphql')
  cy.route(`/typeahead?q=${searchTerm.toLowerCase()}`).as('getTypeAhead')
  cy.get(DATA_SEARCH.autoSuggest).type(searchTerm)
  cy.wait('@getTypeAhead')
  cy.get(DATA_SEARCH.autoSuggestCategory)
    .contains(category)
    .siblings('ul')
    .children('li')
    .first()
    .should('have.text', result)
  cy.get(DATA_SEARCH.buttonSearch).click()
  cy.wait('@postGraphql')
})

Cypress.Commands.add('checkFirstInSearchResults', (category, result, selector) => {
  cy.wait(1000)
  cy.get(DATA_SEARCH.searchResultsCategory).first().should('contain', category)
  cy.get(selector).first().should('have.text', result)
})

Cypress.Commands.add('checkFirstParagraphLinkInSearchResults', (searchResult) => {
  cy.get(DATA_SEARCH.searchResultsParagraphLink).first().should('have.text', searchResult)
})

Cypress.Commands.add('searchAndCheck', (searchTerm, result, result2) => {
  cy.checkAutoSuggestFirstOfAll(searchTerm, result)
  cy.checkFirstParagraphLinkInSearchResults(result2 || result)
})

Cypress.Commands.add('searchInCategoryAndCheckFirst', (searchTerm, category, result, result2) => {
  cy.checkAutoSuggestFirstofCategory(searchTerm, category, result)
  cy.checkFirstParagraphLinkInSearchResults(result2 || result)
})
