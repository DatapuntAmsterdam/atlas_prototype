import { DATA_SEARCH, HOMEPAGE, SEARCH } from './selectors'

Cypress.Commands.add('checkAutoSuggestFirstOfAll', (searchTerm, result) => {
  cy.server()
  cy.route('POST', '/cms_search/graphql/').as('postGraphql')
  cy.route(`/typeahead?q=${searchTerm.replace(/\s+/g, '+').toLowerCase()}`).as('getTypeAhead')
  cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
  cy.get(DATA_SEARCH.autoSuggest).type(searchTerm, { delay: 80 })
  cy.wait('@getTypeAhead')
  cy.wait(500)
  cy.get(DATA_SEARCH.autoSuggestDropDownItem).first().should('have.text', result)
  cy.get(HOMEPAGE.buttonSearch).click()
  cy.wait('@postGraphql')
})

Cypress.Commands.add('checkAutoSuggestFirstofCategory', (searchTerm, category, result) => {
  cy.server()
  cy.route('POST', '/cms_search/graphql/').as('postGraphql')
  cy.route(`/typeahead?q=${searchTerm.replace(/\s+/g, '+').toLowerCase()}`).as('getTypeAhead')
  cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
  cy.get(DATA_SEARCH.autoSuggest).type(searchTerm, { delay: 80 })
  cy.wait('@getTypeAhead')
  cy.wait(500)
  cy.get(DATA_SEARCH.autoSuggest).click()
  cy.get(DATA_SEARCH.autoSuggestCategory)
    .contains(category)
    .siblings('ul')
    .children('li')
    .first()
    .should('have.text', result)
  cy.get(HOMEPAGE.buttonSearch).click()
  cy.wait('@postGraphql')
})

Cypress.Commands.add('checkFirstInSearchResults', (category, result, selector) => {
  cy.get(DATA_SEARCH.buttonFilteren).should('be.visible')
  cy.contains('resultaten)').should('be.visible')
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

Cypress.Commands.add('searchWithFilter', (category, searchTerm) => {
  cy.get(DATA_SEARCH.searchBarFilter).select(category)
  cy.get(SEARCH.input).type(searchTerm)
  cy.get(SEARCH.form).submit()
  cy.wait(['@graphql', '@graphql'])
  cy.wait('@jsonapi')
  cy.contains(`${category} met '${searchTerm}' (`)
})
