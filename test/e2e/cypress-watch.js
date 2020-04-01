const cypress = require('cypress')

const SCRIPTS_FOLDER = process.env.SCRIPTS_FOLDER || 'cypress/integration'

cypress.open({
  config: {
    integrationFolder: SCRIPTS_FOLDER,
  },
})
