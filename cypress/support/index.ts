// ***********************************************************
// This example support/index.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import './authentication-commands'
import './detail-panel-commands'
import './helper-functions'
import './hide-popup'
import './homepage-commands'
import './map-commands'
import './preview-panel-commands'
import './routing-commands'
import './search-commands'

before(() => {
  cy.window().then(() => {
    // waiting for the Window object to become available; without it, intercepts cannot be set up
    // eslint-disable-next-line
    const { interceptApiFixtures } = require('../support/api')
    interceptApiFixtures()
  })
})
