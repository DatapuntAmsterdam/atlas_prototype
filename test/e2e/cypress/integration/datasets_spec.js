const activeFilters = '.c-data-selection-active-filters';
const dataSelection = '.c-data-selection';
const homepage = '.c-homepage';

describe('datasets module', () => {
  describe('user should be able to navigate to the datasets catalogus from the homepage', () => {
    beforeEach(() => {
      cy.server();
      cy.route('https://acc.api.data.amsterdam.nl/dcatd/datasets?*').as('getResults');
      cy.route('https://acc.api.data.amsterdam.nl/dcatd/datasets?/**').as('getResultsWithFilter');
      cy.route('https://acc.api.data.amsterdam.nl/dcatd/datasets/**').as('getResultsDetail');

      // go to the homepage
      cy.visit('/');
      // the homepage should be visible
      cy.get(homepage).should('be.visible');
      // check if the link is in the dom and visible
      cy.get('.c-homepage__block--datasets').should('exist').and('be.visible');
      // the datasets component should not exist yet
      cy.get(dataSelection).should('not.exist');
    });

    it('should open the datasets catalogus without a filter and see results', () => {
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('.c-homepage__block--datasets').find('.qa-button-datasets').click();
      cy.wait('@getResults');

      // the homepage should not be visible anymore
      cy.get(homepage).should('not.be.visible');
      // the data selection should be visible
      cy.get(dataSelection).should('exist').and('be.visible');
      // the title should contain Datasets
      cy.get('h1').contains('Datasets').should('exist').and('be.visible');
      // the datasets filters should not exist
      cy.get(activeFilters).should('not.exist').and('not.be.visible');
      // at least one results should exist
      cy.get('.c-data-selection-catalog__item').should('exist').and('be.visible');
    });

    it('should open a dataset', () => {
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('.c-homepage__block--datasets').get('.qa-theme-link').first().click();
      cy.wait('@getResultsWithFilter');

      // the homepage should not be visible anymore
      cy.get(homepage).should('not.be.visible');
      // the data selection should be visible
      cy.get(dataSelection).should('exist').and('be.visible');
      // the title should contain Datasets
      cy.get('h1').contains('Datasets').should('exist').and('be.visible');
      cy.get('.c-data-selection-catalog__item').first().click();
      cy.wait('@getResultsDetail');

      // as downloading is not testable, we check for the presence of href
      cy.get('.resources-item').should('exist').and('be.visible')
        .and('have.attr', 'dp-follow-link');
    });

    it('should open the datasets catalogus with a filter and see filtered results', () => {
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('.c-homepage__block--datasets').find('.c-catalogus-theme__icon--kaart').click();
      cy.wait('@getResultsWithFilter');

      // the homepage should not be visible anymore
      cy.get(homepage).should('not.be.visible');
      // the datasets component should be visible
      cy.get(dataSelection).should('exist').and('be.visible');
      // the title should contain Datasets
      cy.get('h1').contains('Datasets').should('exist').and('be.visible');
      // the datasets filters should exist
      cy.get(activeFilters).should('exist').and('be.visible');
      // at least one results should exist
      cy.get('.c-data-selection-catalog__item').should('exist').and('be.visible');
    });
  });
});
