const dataSelection = '.c-data-selection';
const homepage = '.c-homepage';
const notification = '.c-panel--warning';
const table = '.c-table';

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
        cy.get(table).should('not.exist').and('not.be.visible');
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
          cy.scrollTo('top');
        });

        it('should not show a notification', () => {
          // a warning notification should not exist
          cy.get(notification).should('not.exist').and('not.be.visible');
        });

        it('should show the table with results', () => {
          // the table with results should exist
          cy.get(table).should('exist').and('be.visible');
        });
      });
    });

    describe('user should be able to navigate to the eigendommen detail view', () => {
      it('should open the correct detail view', () => {
        const route = '/datasets/brk/kadastrale-objecten?filters=eyJlaWdlbmFhcl90eXBlIjoiQXBwYXJ0ZW1lbnRzZWlnZW5hYXIiLCJlaWdlbmFhcl9jYXQiOiJXb25pbmdib3V3Y29ycG9yYXRpZXMiLCJzdGFkc2RlZWxfbmFhbSI6IkNlbnRydW0iLCJnZ3dfbmFhbSI6IkNlbnRydW0tT29zdCJ9&lat=52.372857835281216&legenda=false&listView=true&lng=4.89369867177328';

        cy.visit(route);
        cy.wait('@getDataselectieBrk');
        cy.scrollTo('top');

        cy.get('.c-table__content-row:first-child').click();

        cy.wait('@getBrkObjectExpand');
        cy.get('.qa-detail').should('exist').and('be.visible');
      });
    });

    describe('user should be able to add a filter', () => {
      it('should add the filter to the active filters and filter the results', () => {
        const route = '/datasets/brk/kadastrale-objecten?filters=eyJlaWdlbmFhcl90eXBlIjoiQXBwYXJ0ZW1lbnRzZWlnZW5hYXIiLCJlaWdlbmFhcl9jYXQiOiJXb25pbmdib3V3Y29ycG9yYXRpZXMiLCJzdGFkc2RlZWxfbmFhbSI6IkNlbnRydW0iLCJnZ3dfbmFhbSI6IkNlbnRydW0tT29zdCJ9&lat=52.372857835281216&legenda=false&listView=true&lng=4.89369867177328';

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
              .should('exist').and('be.visible');

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

    describe('user should be able to view a parcel in the leaflet map', () => {
      it('should open the detail view with a leaflet map and a cursor', () => {
        const route = '/datasets/brk/object/idNL.KAD.OnroerendeZaak.11430433270000?legenda=false&zoom=13';

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
