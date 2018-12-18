const SEARCH_QUERY = 'dam';

const AUTO_SUGGEST = {
  INPUT: '#auto-suggest__input',
  RESULT_LIST: '.auto-suggest__dropdown',
  LIST_ITEM_BUTTON: '.auto-suggest__dropdown-category li button'
};

const SEARCHPAGE_SELECTORS = {
  HEADER: '.qa-search-header',
  RESULTS_BLOCK: '.c-search-results__block-content',
  RESULTS_ITEM_LINK: '.qa-list-item-link',
  MORE_BUTTON: '.qa-show-more .qa-dp-link'
};

const DETAIL_PAGE = '.qa-detail';

const HEADINGS = ['Straatnamen', 'Adressen', 'Openbare ruimte', 'Monumenten'];

describe('search module', () => {
  beforeEach(() => {
    cy.server();
    cy.route(`https://acc.api.data.amsterdam.nl/typeahead?q=${SEARCH_QUERY}`).as('typeaheadResults');
    cy.route('/bag/openbareruimte/*').as('getDetail');
    cy.defineSearchRoutes();
    cy.visit('/');
    cy.get('#auto-suggest__input').type(SEARCH_QUERY);
  });

  describe('autosuggest', () => {
    beforeEach(() => {
      cy.wait('@typeaheadResults');
    });

    it('should be able to navigate throught results with arrow keys', () => {
      const inactiveClass = 'auto-suggest__dropdown-item--inactive';
      const activeClass = 'auto-suggest__dropdown-item--active';
      cy.get(AUTO_SUGGEST.INPUT).type('{downarrow}{downarrow}');

      cy.get(AUTO_SUGGEST.LIST_ITEM_BUTTON).as('listItemButton');
      cy.get('@listItemButton').eq(1).should('not.have.class', inactiveClass);
      cy.get('@listItemButton').eq(1).should('have.class', activeClass);

      cy.get(AUTO_SUGGEST.INPUT).type('{uparrow}');
      cy.get('@listItemButton').eq(1).should('have.class', inactiveClass);
    });

    it('should to to the search result page when selecting the "..." option', () => {
      cy.get(AUTO_SUGGEST.LIST_ITEM_BUTTON).as('listItemButton2');
      cy.get('@listItemButton2').eq(3).click();
      cy.waitForSearch(false);

      cy.get(SEARCHPAGE_SELECTORS.RESULTS_BLOCK).should('exist');
    });

    it('should to to the detail page when selecting a result', () => {
      cy.get(AUTO_SUGGEST.LIST_ITEM_BUTTON).as('listItemButton2');
      cy.get('@listItemButton2').eq(2).click();
      cy.wait('@getDetail');

      cy.get(DETAIL_PAGE).should('exist');
    });
  });

  describe('search results pages', () => {
    beforeEach(() => {
      cy.get('.auto-suggest').submit();
      cy.waitForSearch(false);
    });

    it('should contain the proper titles', () => {
      cy.get(SEARCHPAGE_SELECTORS.HEADER).each((value, index) => {
        expect(value).to.contain(HEADINGS[index]);
      });
    });

    it('should be able to show more results', () => {
      cy.get(SEARCHPAGE_SELECTORS.HEADER)
        .contains(HEADINGS[1])
        .closest(SEARCHPAGE_SELECTORS.RESULTS_BLOCK)
        .find(SEARCHPAGE_SELECTORS.MORE_BUTTON)
        .click();

      cy.get(SEARCHPAGE_SELECTORS.RESULTS_ITEM_LINK).closest('li').as('resultItems');

      cy.get('@resultItems')
        .contains('nevenadres')
        .should('exist')
        .and('be.visible');

      cy.get('@resultItems')
        .contains('verblijfsobject gevormd')
        .should('exist')
        .and('be.visible');

      cy.get(SEARCHPAGE_SELECTORS.HEADER).contains(`met '${SEARCH_QUERY}'`).should('exist');
    });
  });
});
