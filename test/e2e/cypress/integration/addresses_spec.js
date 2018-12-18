import { getCountFromHeader } from '../support/helper-functions';

const dataSelection = '.c-data-selection';
const homepage = '.c-homepage';

describe('addresses module', () => {
  beforeEach(() => {
    cy.server();
    cy.route('/dataselectie/bag/*').as('getResults');

    // go to the homepage
    cy.visit('/');
    // the homepage should be visible
    cy.get(homepage).should('exist').and('be.visible');
    // check if the link is in the dom and visible
    cy.get('#homepage-address-block').should('exist').and('be.visible');
    // the data-selection should not exist yet
    cy.get(dataSelection).should('not.exist');
    // click on the link to go to the addresses
    cy.get('.c-homepage__block-button').contains('Adressentabel').click();
    // scroll to top so first item is in view
    cy.scrollTo('top');

    cy.wait('@getResults');
  });

  describe('user should be able to navigate to the addresses from the homepage', () => {
    it('should open the address catalogus', () => {
      // the homepage should not be visible anymore
      cy.get(homepage).should('not.be.visible');
      // the data selection should exist
      cy.get(dataSelection).should('exist').and('be.visible');
      // the title should contain Adressen
      cy.get('h1').contains('Adressen').should('exist').and('be.visible');
    });
  });

  describe('user should be able to add a filter', () => {
    it('should add the filter to the active filters and filter the results', () => {
      // get the first category
      cy.get('.qa-available-filters')
        .find('.c-data-selection-available-filters__category')
        .first()
        .then((group) => {
          // get the innerText of the nested h2
          const category = group[0].children[0].innerText;
          // get the innerText of the first nested li
          const selectedFilter = group[0].children[1].children[0].innerText;
          // click the filter that contains the selectedFilter variable
          cy.get('.c-data-selection-available-filters__item')
            .find('.qa-option-label')
            .contains(selectedFilter)
            .click();

          cy.wait('@getResults');

          // the filter should be added to the active filters (stadsdeel)
          cy.get('.c-data-selection-active-filters__listitem')
            .find('span')
            .contains(selectedFilter)
            .should('exist').and('be.visible');

          // get the position of the category in the th's of the table
          cy.get('th.c-table__header-field').each((th, index) => {
            // if the position is equal to the category
            if (th[0].innerText === category) {
              // get al the content the td's with the same position as the categoryGroup they all
              // should contain the same value as the `selectedFilter`
              cy.get('.c-table__content-row')
                .find(`td:nth-child(${index + 1})`)
                .contains(selectedFilter)
                .should('exist').and('be.visible');
            }
          });
        });
    });
  });

  describe('user should be able to navigate to the address detail view', () => {
    it('should open the detail view with the correct address', () => {
      cy.route('/bag/nummeraanduiding/*').as('getNummeraanduiding');
      cy.route('/bag/verblijfsobject/*').as('getVerblijfsobject');
      cy.route('/bag/pand/?verblijfsobjecten__id=*').as('getPanden');
      cy.route('/brk/object-expand/?verblijfsobjecten__id=*').as('getObjectExpand');
      cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getSitueringen');
      cy.route('/monumenten/monumenten/*').as('getMonument');

      cy.get('th.c-table__header-field').first()
        .then((firstTableHeader) => {
          const selectedGroup = firstTableHeader[0].innerText.trim();
          cy.get('.c-table__content-row').first().find('td:nth-child(1)')
            .then((firstValue) => {
              const selectedValue = firstValue[0].innerText.trim();
              // click on the firstItem
              cy.get('.c-table__content-row').first().click();

              cy.wait('@getNummeraanduiding');
              cy.wait('@getVerblijfsobject');
              cy.wait('@getPanden');
              cy.wait('@getObjectExpand');
              cy.wait('@getSitueringen');
              cy.wait('@getMonument');

              // the detail view should exist
              cy.get('.qa-detail').should('exist').and('be.visible');
              // the selectedGroup should exist
              cy.get('dt').contains(selectedGroup).should('exist').and('be.visible');
              // the selectedValue should exist as a sibling
              cy.get('dt').contains(selectedGroup)
                .siblings('dd').contains(selectedValue)
                .should('exist').and('be.visible');
            });
        });
    });
  });

  describe('user should be able to view a cursor in the leaflet map', () => {
    it('should open the detail view with a leaflet map and a cursor', () => {
      cy.route('/bag/nummeraanduiding/*').as('getNummeraanduiding');
      cy.route('/bag/verblijfsobject/*').as('getVerblijfsobject');
      cy.route('/bag/pand/?verblijfsobjecten__id=*').as('getPanden');
      cy.route('/brk/object-expand/?verblijfsobjecten__id=*').as('getObjectExpand');
      cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getSitueringen');
      cy.route('/monumenten/monumenten/*').as('getMonument');

      // click on the first item in the table
      cy.get('.c-table__content-row').first().click();

      cy.wait('@getNummeraanduiding');
      cy.wait('@getVerblijfsobject');
      cy.wait('@getPanden');
      cy.wait('@getObjectExpand');
      cy.wait('@getSitueringen');
      cy.wait('@getMonument');

      // the cursor should be rendered inside the leaflet map
      cy.get('.leaflet-marker-icon').should('exist').and('be.visible');
    });
  });

  describe('user should be be able to filter on an area', () => {
    it('should show the addresses and map when selected', () => {
      cy.route('/dataselectie/bag/geolocation/*').as('getGeoResults');

      let totalCount;

      // Get the number in the title before filtering
      cy.get('h1').then((title) => {
        totalCount = getCountFromHeader(title.text());
      });

      // click on "AMC" in the left filter menu
      cy.get('.c-data-selection-available-filters__item').contains('AMC').click();
      cy.wait('@getResults');

      // Expect the number in the title after filtering to be smaller than the number before
      // filtering
      cy.get('h1').then((title) => {
        const filteredCount = getCountFromHeader(title.text());
        expect(filteredCount).to.be.below(totalCount);
      });

      // click on "kaart weergeven"
      cy.get('.c-toggle-view-button.qa-dp-link').click();
      cy.wait('@getGeoResults');

      // map should be visible now
      cy.get('.qa-map-container').should('exist').and('be.visible');
      // , with large right column
      cy.get('.qa-dashboard__column--right').should('exist').and('be.visible');
      // count the number of cluster icons on the map
      cy.get('.o-highlight-cluster').then((items) => {
        expect(items.length).to.gte(1);
      });
      // list should be visible in right column
      cy.get('ul.o-list').should('exist').and('be.visible');
      // active filter should show
      cy.get('.c-data-selection-active-filters__listitem')
        .contains('AMC')
        .should('exist').and('be.visible');
    });
  });
});
