/* eslint-disable */
describe.skip('addresses module', () => {
  beforeEach(() => {
    // go to the homepage
    cy.visit('http://localhost:8080/');
    // check if the link is in the dom and visible
    cy.get('.c-homepage__block--adressen').should('exist').and('be.visible');
    // the data-selection should not exist yet
    cy.get('.c-data-selection').should('not.exist');
    // click on the link to go to the addresses
    cy.get('.c-homepage__block--adressen').click();
    // scroll to top so first item is in view
    cy.scrollTo('top');
  });

  describe('user should be able to navigate to the addresses from the homepage', () => {
    it('should open the address catalogus', () => {
      // the homepage should not be visible anymore
      cy.get('.c-homepage').should('not.be.visible');
      // the data selection should exist
      cy.get('.c-data-selection').should('exist').and('be.visible');
      // the title should contain Adressen
      cy.get('h1').contains('Adressen').should('exist').and('be.visible');
    });
  });

  describe('user should be able to add a filter', () => {
    it('should add the filter to the active filters and filter the results', () => {
      // get the first category
      cy.get('.qa-available-filters').find('.c-data-selection-available-filters__category').first()
      .then((group) => {
        // get the innerText of the nested h2
        const category = group[0].children[0].innerText;
        // get the innerText of the first nested li
        const selectedFilter = group[0].children[1].children[0].innerText;
        // click the filter that contains the selectedFilter variable
        cy.get('.c-data-selection-available-filters__item').find('.qa-option-label').contains(selectedFilter).click();
        // the filter should be added to the active filters (stadsdeel)
        cy.get('.c-data-selection-active-filters__listitem').find('span').contains(selectedFilter).should('exist').and('be.visible');

        // get the position of the category in the th's of the table
        cy.get('th.c-table__header-field').each((th, index) => {
          // if the position is equal to the category
          if (th[0].innerText === category) {
            // get al the content the td's with the same position as the categoryGroup they all should contain the same value as the `selectedFilter`
            cy.get('.c-table__content-row').find(`td:nth-child(${index + 1})`).contains(selectedFilter).should('exist').and('be.visible');
          }
        });
      });
    });
  });

  describe('user should be able to navigate to the address detail view', () => {
    it('should open the detail view with the correct address', () => {
      cy.get('th.c-table__header-field').first()
      .then((firstTableHeader) => {
        const selectedGroup = firstTableHeader[0].innerText;
        cy.get('.c-table__content-row').first().find(`td:nth-child(1)`)
        .then((firstValue) => {
          const selectedValue = firstValue[0].innerText;
          // click on the firstItem
          cy.get('.c-table__content-row').first().click();
          // the detail view should exist
          cy.get('.qa-detail').should('exist').and('be.visible');
          // the selectedGroup should exist
          cy.get('dt').contains(selectedGroup).should('exist').and('be.visible');
          // the selectedValue should exist as a sibling
          cy.get('dt').contains(selectedGroup).siblings('dd').contains(selectedValue).should('exist').and('be.visible');
        })
      })
    });
  });

  describe('user should be able to view a cursor in the leaflet map', () => {
    it('should open the detail view with a leaflet map and a cursor', () => {
      // click on the first item in the table
      cy.get('.c-table__content-row').first().click();
      // the cursor should be rendered inside the leaflet map
      cy.get('.leaflet-marker-icon').should('exist').and('be.visible');
    });
  });
});
