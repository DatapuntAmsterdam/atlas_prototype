// Based on: https://github.com/cypress-io/cypress/issues/416#issuecomment-337400871
// Runs Cypress runner per integration test. Mitigates memory hogging issues.
// Once a Cypress version is released that clears renderer
// between tests this hack (entire file) can be removed.

/* eslint-disable no-console */
const cypress = require('cypress')
const util = require('util')

const glob = util.promisify(require('glob'))

const started = new Date()
let numFailed = 0
const summary = []

const SCRIPTS_FOLDER = process.env.SCRIPTS_FOLDER || 'cypress/integration'

function formatDuration(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  return `${hours}:${minutes}:${seconds}`
}

return glob(`${SCRIPTS_FOLDER}/**/*`, {
  nodir: true,
  realpath: true,
})
  .then(async (specs) => {
    for (const spec of specs) {
      await cypress
        .run({
          spec,
          config: {
            integrationFolder: SCRIPTS_FOLDER,
          },
        })
        .then((results) => {
          numFailed += results.totalFailed
          const name = spec.split('/')[spec.split('/').length - 1]
          summary.push({
            name,
            totalDuration: results.totalDuration,
            totalSuites: results.totalSuites,
            totalTests: results.totalTests,
            totalFailed: results.totalFailed,
            totalPassed: results.totalPassed,
            totalPending: results.totalPending,
            totalSkipped: results.totalSkipped,
          })

          return name
        })
        .catch((name) => {
          console.warn('Failed test', name)
        })
    }
  })
  .then(() => {
    console.log('\n-----------------------------')
    console.log(`Cypress end to end tests summary:`)
    summary.forEach((item) => {
      console.log(`\n${item.name}
- Total Suites: ${item.totalSuites}
- Total Tests: ${item.totalTests}
- Total Failed: ${item.totalFailed}
- Total Passed: ${item.totalPassed}
- Total Pending: ${item.totalPending}
- Total Skipped: ${item.totalSkipped}
- Total Duration: ${item.totalDuration / 1000} seconds
`)
    })
    console.log('\n-----------------------------')

    const duration = new Date() - started

    console.log('\n--All Done--\n')
    console.log('Total duration:', formatDuration(duration))
    console.log('Exiting with final code (=total tests failed):', numFailed)
    console.log('\n-----------------------------\n')

    process.exit(numFailed)
  })
  .catch((err) => {
    console.error(err)
    throw err
  })
