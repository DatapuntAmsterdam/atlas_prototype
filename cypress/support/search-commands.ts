import { DATA_SEARCH, HOMEPAGE } from './selectors'

declare global {
  // eslint-disable-next-line no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      checkAutoSuggestFirstOfAll(searchTerm: string, result: string): void
      checkAutoSuggestFirstofCategory(searchTerm: string, category: string, result: string): void
      checkFirstInSearchResults(category: string, result: string, selector: string): void
      checkFirstParagraphLinkInSearchResults(searchResult: string): void
      searchAndCheck(searchTerm: string, result: string, result2?: string): void
      searchInCategoryAndCheckFirst(
        searchTerm: string,
        category: string,
        result: string,
        result2?: string,
      ): void
      searchWithFilter(category: string, searchTerm: string): void
    }
  }
}

Cypress.Commands.add('checkAutoSuggestFirstOfAll', (searchTerm: string, result: string) => {
  cy.intercept('POST', '/cms_search/graphql/').as('postGraphql')
  cy.intercept(`**/typeahead?q=${searchTerm.replace(/\s+/g, '+').toLowerCase()}*`).as(
    'getTypeAhead',
  )
  cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
  cy.get(DATA_SEARCH.autoSuggest).type(searchTerm, { delay: 80 })
  cy.wait('@getTypeAhead')
  cy.wait(500)
  cy.get(DATA_SEARCH.autoSuggestDropDownItem).first().should('have.text', result)
  cy.get(HOMEPAGE.buttonSearch).click()
  cy.wait('@postGraphql')
})

Cypress.Commands.add(
  'checkAutoSuggestFirstofCategory',
  (searchTerm: string, category: string, result: string) => {
    cy.intercept('POST', '/cms_search/graphql/').as('postGraphql')
    cy.intercept(`**/typeahead?q=${searchTerm.replace(/\s+/g, '+').toLowerCase()}*`).as(
      'getTypeAhead',
    )
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
  },
)

Cypress.Commands.add(
  'checkFirstInSearchResults',
  (category: string, result: string, selector: string) => {
    cy.get(DATA_SEARCH.buttonFilteren).should('be.visible')
    cy.contains('resultaten)').should('be.visible')
    cy.get(DATA_SEARCH.searchResultsCategory).first().should('contain', category)
    cy.get(selector).first().should('have.text', result)
  },
)

Cypress.Commands.add('checkFirstParagraphLinkInSearchResults', (searchResult: string) => {
  cy.get(DATA_SEARCH.searchResultsParagraphLink).first().should('have.text', searchResult)
})

Cypress.Commands.add('searchAndCheck', (searchTerm: string, result: string, result2?: string) => {
  cy.checkAutoSuggestFirstOfAll(searchTerm, result)
  cy.checkFirstParagraphLinkInSearchResults(result2 || result)
})

Cypress.Commands.add(
  'searchInCategoryAndCheckFirst',
  (searchTerm: string, category: string, result: string, result2?: string) => {
    cy.checkAutoSuggestFirstofCategory(searchTerm, category, result)
    cy.checkFirstParagraphLinkInSearchResults(result2 || result)
  },
)

Cypress.Commands.add('searchWithFilter', (category, searchTerm) => {
  cy.get(DATA_SEARCH.searchBarFilter).select(category)
  cy.get(DATA_SEARCH.input).type(searchTerm)
  cy.get(DATA_SEARCH.form).submit()
  cy.wait(['@graphql', '@graphql'])
  cy.wait('@jsonapi')
  cy.contains(`${category} met '${searchTerm}' (`)
})
