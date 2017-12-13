/* eslint-disable */
// import { API_ROOT, AUTH_PATH } from '../../src/shared/services/auth/auth';
import stateTokenGenerator from '../../src/shared/services/state-token-generator/state-token-generator';

export function login(type = 'EMPLOYEE_PLUS') {
  const stateToken = stateTokenGenerator();

  cy.window().its('sessionStorage').invoke('setItem', 'returnPath', '#');
  cy.window().its('sessionStorage').invoke('setItem', 'stateToken', stateToken);

  // TODO: Replace URL with `${API_ROOT}${AUTH_PATH}...` as soon as Cypress supports the spread operator
  return cy.request({
    url: [
      'https://acc.api.data.amsterdam.nl/oauth2/authorize?',
      'idp_id=datapunt&',
      'response_type=token&',
      'client_id=citydata&',
      'scope=BRK%2FRS%20BRK%2FRSN%20BRK%2FRO%20WKPB%2FRBDU%20MON%2FRBC%20MON%2FRDM%20HR%2FR&',
      `state=${encodeURIComponent(stateToken)}&`,
      `redirect_uri=${encodeURIComponent('http://localhost:8080/')}`
    ].join(''),
    followRedirect: false
  })
    .then((response) => (
      cy.request({
        url: response.headers.location,
        followRedirect: false
      })
    ))
    .then((response) => (
      cy.request({
        method: 'POST',
        url: `https://acc.api.data.amsterdam.nl/auth/idp/${response.body.match(/action="(.*?)"/).pop()}`,
        form: true,
        body: {
          email: Cypress.env(`USERNAME_${type}`),
          password: Cypress.env(`PASSWORD_${type}`),
          type: type.toLowerCase()
        },
        followRedirect: false
      })
    ))
    .then((response) => (
      cy.request({
        url: response.headers.location,
        followRedirect: false
      })
    ))
    .then((response) => (
      cy.visit(response.headers.location)
    ));
}

export function logout() {
  cy.get('.qa-menu__user-menu button').click();
  cy.get('.qa-menu__user-menu dp-logout-button button').click();
}
