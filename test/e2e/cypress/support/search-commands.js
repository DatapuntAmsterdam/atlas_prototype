import { DATA_SEARCH } from './selectors'

Cypress.Commands.add('checkAutoSuggestFirstOfAll', (searchTerm, result) => {
  cy.server()
  cy.route('POST', '/cms_search/graphql/').as('postGraphql')
  cy.get(DATA_SEARCH.autoSuggest).type(searchTerm)
  cy.get(DATA_SEARCH.autoSuggestDropDownItem).first().should('have.text', result)
  cy.get(DATA_SEARCH.buttonSearch).click()
  cy.wait('@postGraphql')
})

Cypress.Commands.add('checkAutoSuggestFirstofCategory', (searchTerm, category, result) => {
  cy.server()
  cy.route('POST', '/cms_search/graphql/').as('postGraphql')
  cy.get(DATA_SEARCH.autoSuggest).type(searchTerm)
  cy.get(DATA_SEARCH.autoSuggestCategory)
    .contains(category)
    .siblings('ul')
    .children('li')
    .first()
    .should('have.text', result)
  cy.get(DATA_SEARCH.buttonSearch).click()
  cy.wait('@postGraphql')
})

Cypress.Commands.add('checkFirstCardInSearchResults', (category, result) => {
  cy.wait(500)
  cy.get(DATA_SEARCH.searchResultsCategory).first().should('contain', category)
  cy.get('[class*=EditorialCard__StyledHeading]').first().should('have.text', result)
})

Cypress.Commands.add('checkFirstLinkInSearchResults', (searchResult) => {
  cy.get(DATA_SEARCH.searchResultsLink).first().should('have.text', searchResult)
})

Cypress.Commands.add('searchAndCheck', (searchTerm, result, result2) => {
  cy.checkAutoSuggestFirstOfAll(searchTerm, result)
  cy.checkFirstLinkInSearchResults(result2 || result)
})

Cypress.Commands.add('searchInCategoryAndCheckFirst', (searchTerm, category, result, result2) => {
  cy.checkAutoSuggestFirstofCategory(searchTerm, category, result)
  cy.checkFirstLinkInSearchResults(result2 || result)
})
