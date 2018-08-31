// Based on: https://github.com/cypress-io/cypress/issues/416#issuecomment-337400871
// Runs Cypress runner per integration test. Mitigates memory hogging issues.
// Once a Cypress version is released that clears renderer
// between tests this hack (entire file) can be removed.

const cypress = require('cypress')
const Promise = require('bluebird')

const glob = Promise.promisify(require('glob'))

const started = new Date()
let numFailed = 0

return glob('test/cypress/integration/**/*', {
  nodir: true,
  realpath: true,
})
.tap((specs) => {
  console.log('Found ', specs.length, ' specs:\n\n', specs)
})
.each((spec) => {
  console.log('\nRunning spec:', spec)

  return cypress.run({
    spec: spec,
    env: {
      API_ROOT: process.env.API_ROOT,
      USERNAME_EMPLOYEE: process.env.USERNAME_EMPLOYEE,
      USERNAME_EMPLOYEE_PLUS: process.env.USERNAME_EMPLOYEE_PLUS,
      PASSWORD_EMPLOYEE: process.env.PASSWORD_EMPLOYEE,
      PASSWORD_EMPLOYEE_PLUS: process.env.PASSWORD_EMPLOYEE_PLUS
    }
  })
  .then((results) => {
    numFailed += results.failures
  })
})
.then(() => {
  const duration = new Date() - started

  console.log('\n--All Done--\n')
  console.log('Total duration:', duration) // format this however you like
  console.log('Exiting with final code:', numFailed)

  process.exit(numFailed)
})
.catch((err) => {
  console.error(err)
  throw err
})
