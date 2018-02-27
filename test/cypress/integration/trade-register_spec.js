/* eslint-disable */
import { login, logout } from '../services/authentication';

describe('trade-register module', () => {
  describe('user should be able to navigate to the trade-register from the homepage', () => {
    it('should open the trade register', () => {
      // go to the homepage
      cy.visit('/');
      // check if the link is in the dom and visible
      cy.get('.c-homepage__block--vestigingen').should('exist').and('be.visible');
      // the data-selection should not exist yet
      cy.get('.c-data-selection').should('not.exist');
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('.c-homepage__block--vestigingen').click();
      // the homepage should not be visible anymore
      cy.get('.c-homepage').should('not.be.visible');
      // the data selection should exist
      cy.get('.c-data-selection').should('exist').and('be.visible');
      // the title should contain Adressen
      cy.get('h1').contains('Vestigingen').should('exist').and('be.visible');
    });
  });

  describe('not authenticated', () => {
    beforeEach(() => {
      // go to the homepage
      cy.visit('/');
      // click on the link to go to the trade register
      cy.get('.c-homepage__block--vestigingen').click();
    });

    describe('user should not be able to view the trade register', () => {
      it('should show a notification that the user must authenticate', () => {
        // a warning notification should be shown that the user must authenticate
        cy.get('.c-panel--warning').should('exist').and('be.visible');
      });

      it('should not show the table with results', () => {
        // the table with results should not exist
        cy.get('.c-table').should('not.exist').and('not.be.visible');
      });
    });
  });

  describe('authenticated', () => {
    before(() => {
      login();
    });

    after(() => {
      logout();
    })

    beforeEach(() => {
      // go to the homepage
      cy.visit('/');
      // click on the link to go to the trade register
      cy.get('.c-homepage__block--vestigingen').click();
      cy.scrollTo('top');
    });

    describe('user should be able to view the trade register', () => {
      it('should not show a notification', () => {
        // a warning notification should not exist
        cy.get('.c-panel--warning').should('not.exist').and('not.be.visible');
      });

      it('should show the table with results', () => {
        // the table with results should exist
        cy.get('.c-table').should('exist').and('be.visible');
      });
    });

    describe('user should be able to navigate to the trade register detail view', () => {
      it('should open the correct detail view', () => {
        cy.get('.c-table__content-row:first-child').click();
        cy.get('.qa-detail').should('exist').and('be.visible');
      });
    });
  });
});
