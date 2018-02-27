import stateTokenGenerator from '../../../src/shared/services/state-token-generator/state-token-generator';

const checkEnvironmentVariablesSet = () => {
  const variables = [
    'USERNAME_EMPLOYEE',
    'USERNAME_EMPLOYEE_PLUS',
    'PASSWORD_EMPLOYEE',
    'PASSWORD_EMPLOYEE_PLUS'
  ];
  for (const variable of variables) {
    if(Cypress.env(variable) === undefined) {
      throw new Error('Environment variable not set: ' + variable);
    }
  }
}

export function login(type = 'EMPLOYEE_PLUS') {
  checkEnvironmentVariablesSet();

  const stateToken = stateTokenGenerator();

  cy.window().its('sessionStorage').invoke('setItem', 'returnPath', '#');
  cy.window().its('sessionStorage').invoke('setItem', 'stateToken', stateToken);

  const redirectUri = 'http://localhost:8080/';
  const url = [
    'https://acc.api.data.amsterdam.nl/oauth2/authorize?',
    'idp_id=datapunt&',
    'response_type=token&',
    'client_id=citydata&',
    'scope=BRK%2FRS%20BRK%2FRSN%20BRK%2FRO%20WKPB%2FRBDU%20MON%2FRBC%20MON%2FRDM%20HR%2FR&',
    `state=${encodeURIComponent(stateToken)}&`,
    `redirect_uri=${encodeURIComponent(redirectUri)}`
  ].join('');

  // Open IDP (SSO)
  // TODO: Replace URL with `${API_ROOT}${AUTH_PATH}...` as soon as Cypress supports the spread operator
  return cy.request({
    url,
    followRedirect: false
  })

    // Follow redirect to login page manually
    .then((response) =>
      cy.request({
        url: response.headers.location,
        followRedirect: false
      })
    )

    // Post credentials and account type
    // extracts url from form
    .then((response) =>
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
    )

    // Follow redirect manually
    .then((response) =>
      cy.request({
        url: response.headers.location,
        followRedirect: false
      })
    )

    // Return to the application
    .then((response) => {
        // Replace redirect URI from earlier (localhost:8080) with baseUrl
        const originalUrl = response.headers.location;
        const baseUrl = Cypress.config('baseUrl')
        const returnUrl = originalUrl.replace(redirectUri, baseUrl);
        return cy.visit(returnUrl)
    });
}

export function logout() {
  cy.get('.qa-menu__user-menu button').click();
  cy.get('.qa-menu__user-menu dp-logout-button button').click();
}
