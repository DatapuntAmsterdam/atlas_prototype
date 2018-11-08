const cypress = require('cypress')

const SCRIPTS_FOLDER =  process.env.SCRIPTS_FOLDER || 'test/cypress/integration';

return cypress.run({
  config: {
    integrationFolder: SCRIPTS_FOLDER,
    numTestsKeptInMemory: 10
  },
  env: {
    API_ROOT: process.env.API_ROOT,
    USERNAME_EMPLOYEE: process.env.USERNAME_EMPLOYEE,
    USERNAME_EMPLOYEE_PLUS: process.env.USERNAME_EMPLOYEE_PLUS,
    PASSWORD_EMPLOYEE: process.env.PASSWORD_EMPLOYEE,
    PASSWORD_EMPLOYEE_PLUS: process.env.PASSWORD_EMPLOYEE_PLUS
  },
  // Uncomment next line for debugging of only one script
  // spec: 'test/cypress/integration/map_spec.js'
})
.then((results) => {
  if(results.totalFailed > 0) {
    process.exit(results.totalFailed)
  }
})
.catch((err) => {
  console.error(err)
  process.exit(1)
})
