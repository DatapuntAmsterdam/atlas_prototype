import { DATA_SELECTION_TABLE } from '../support/selectors';

const dataSelection = '.c-data-selection';
const homepage = '.c-homepage';
const notification = '.qa-notification';

describe('parcel-ownership (eigendommen) module', () => {
  describe('user should be able to navigate to the parcel-ownership from the homepage', () => {
    it('should open the parcel-ownership page', () => { // TODO reactivate when feature switch is removed
      // go to the homepage
      cy.visit('/');
      // the homepage should be visible
      cy.get(homepage).should('exist').and('be.visible');
      // check if the link is in the dom and visible
      cy.get('#homepage-address-block').should('exist').and('be.visible');
      // the data-selection should not exist yet
      cy.get(dataSelection).should('not.exist');
      // click on the link to go to navigate to the page
      cy.get('.homepage-block__link').contains('Kadaster-tabel').click();
      // the homepage should not be visible anymore
      cy.get(homepage).should('not.be.visible');
      // the data selection should exist
      cy.get(dataSelection).should('exist').and('be.visible');
      // the title should contain Kadastrale objecten met zakelijk rechthebbenden
      cy.get('h1').contains('Kadastrale objecten met zakelijk rechthebbenden').should('exist').and('be.visible');
    });
  });

  describe('not authenticated', () => {
    before(() => {
      cy.logout();
    });

    beforeEach(() => {
      // go to the homepage
      cy.visit('/');
      // click on the link to go navigate to the page
      cy.get('.homepage-block__link').contains('Kadaster-tabel').click();
    });

    describe('user should not be able to view the kadaster data', () => { // TODO reactivate when feature switch is removed
      it('should show a notification that the user must authenticate', () => {
        // a warning notification should be shown that the user must authenticate
        cy.get(notification).should('exist').and('be.visible');
      });

      it('should not show the table with results', () => {
        // the table with results should not exist
        cy.get(DATA_SELECTION_TABLE.table).should('not.exist').and('not.be.visible');
      });
    });
  });

  describe('authenticated', () => {
    before(() => {
      cy.login();
    });

    after(() => {
      cy.logout();
    });

    beforeEach(() => {
      cy.server();
      cy.route('/dataselectie/brk/*').as('getDataselectieBrk');
      cy.route('/bag/nummeraanduiding/*').as('getNummeraanduiding');
      cy.route('/brk/object-expand/*').as('getBrkObjectExpand');
      cy.route('/brk/object/*').as('getBrkObject');
    });

    describe('user should be able to view the eigendommen', () => {
      describe('should navigate from the homepage', () => { // TODO reactivate when feature switch is removed
        beforeEach(() => {
          // go to the homepage
          cy.visit('/');
          // click on the link to go to the eigendommen
          cy.get('.homepage-block__link').contains('Kadaster-tabel').click();

          cy.wait('@getDataselectieBrk');
          // cy.scrollTo('top');
        });

        it('should not show a notification', () => {
          // a warning notification should not exist
          cy.get(notification).should('not.exist').and('not.be.visible');
        });

        it('should show the table with results', () => {
          // the table with results should exist
          cy.get(DATA_SELECTION_TABLE.table).should('exist').and('be.visible');
        });
      });
    });

    describe.skip('user should be able to navigate to the eigendommen detail view', () => {
      it('should open the correct detail view', () => {
        const route = '/data/brk/kadastrale-objecten?center=52.371897%2C4.8933155&filters=%7B"stadsdeel_naam"%3A"Centrum"%2C"buurt_naam"%3A"Amstelveldbuurt"%7D&zoom=8';

        cy.visit(route);
        cy.wait('@getDataselectieBrk');
        cy.scrollTo('top');

        cy.get(`${DATA_SELECTION_TABLE.body} ${DATA_SELECTION_TABLE.row}:first-child`).click();

        cy.wait('@getBrkObjectExpand');
        cy.get('.qa-detail').should('exist').and('be.visible');
      });
    });

    describe.skip('user should be able to add a filter', () => {
      it('should add the filter to the active filters and filter the results', () => {
        const route = '/data/brk/kadastrale-objecten?center=52.371897%2C4.8933155&filters=%7B"stadsdeel_naam"%3A"Centrum"%2C"buurt_naam"%3A"Amstelveldbuurt"%7D&zoom=8';

        cy.visit(route);
        cy.wait('@getDataselectieBrk');
        cy.scrollTo('top');

        // get the first category
        cy.get('.qa-available-filters')
          .find('.c-data-selection-available-filters__category')
          .first()
          .then((group) => {
            // get the innerText of the nested h2
            const category = group[0].children[0].innerText;
            // get the innerText of the first nested li
            const selectedFilter = 'Amstelveldbuurt';
            cy.get('.c-data-selection-available-filters__item')
              .find('.qa-option-label')
              .contains(selectedFilter)
              .should('exist')
              .and('be.visible');

            cy.get('.c-data-selection-available-filters__item')
              .find('.qa-option-label')
              .contains(selectedFilter)
              .click({ force: true });

            cy.wait('@getDataselectieBrk');
            cy.scrollTo('top');

            // the filter should be added to the active filters (stadsdeel)
            cy.get('.c-data-selection-active-filters__listitem')
              .find('span')
              .contains(selectedFilter)
              .should('exist')
              .and('be.visible');

            // get the position of the category in the th's of the table
            cy.get(`${DATA_SELECTION_TABLE.head} ${DATA_SELECTION_TABLE.cell}`).each((th, index) => {
              // if the position is equal to the category
              if (th[0].innerText === category) {
                // get al the content the td's with the same position as the categoryGroup they all
                // should contain the same value as the `selectedFilter`
                cy.get(DATA_SELECTION_TABLE.row)
                  .find(`${DATA_SELECTION_TABLE.cell}:nth-child(${index + 1})`)
                  .contains(selectedFilter)
                  .should('exist').and('be.visible');
              }
            });
          });
      });
    });

    describe('user should be able to view a parcel in the leaflet map', () => {
      it('should open the detail view with a leaflet map and a cursor', () => {
        const route = '/data/brk/object/idNL.KAD.OnroerendeZaak.11430433270000?legenda=false&zoom=13';

        // open the detail
        cy.visit(route);

        cy.wait('@getNummeraanduiding');
        cy.wait('@getBrkObjectExpand');
        cy.wait('@getBrkObject');

        // the cursor should be rendered inside the leaflet map
        cy.get('.leaflet-interactive').should('exist').and('be.visible');
      });
    });
  });
});
