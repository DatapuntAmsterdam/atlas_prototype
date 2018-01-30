/*
 * pa11y.js will start a dev server with npm start.
 * When everything builds fine. It will start an aria test
 * the config file contains all urls needed for testing to be successful.
 * After running tests it will kill all processes involved.
 */

import chalk from 'chalk';
import pa11y from 'pa11y';
import pAll from 'p-all';
import path from 'path';
import reporter from 'pa11y-reporter-cli';
import { spawn } from 'child_process';

import config from './pa11y-config';

const CONCURRENT_TESTS = 1;
const filename = name => path.join(__dirname, '..', 'pa11y', `${name}.png`);

console.log('Pa11y testing...');

const checkActions = () => { // flatten actions
  const actions = config.urls.reduce(
    (acc, next) => next.actions ? [...acc, ...next.actions] : acc,
    []);
  const invalidActions = actions.filter((value) => pa11y.isValidAction(value) === false);
  if (invalidActions.length > 0) {
    console.error('invalid actions encountered:');
    invalidActions.forEach(console.error);
    process.exit(1);
  }
}
console.log('Pa11y: checking configuration');
checkActions();

console.log('Pa11y: starting dev server...');
const defaults = config.defaults || {};
const httpServer = spawn('http-server', ['./dist']);

let running = false;
let testing = false;

httpServer.stdout.on('data', (buffer) => {
  running = buffer.toString('utf8').includes('Available on:') || running;

  if (!running) {
    process.stdout.write(buffer.toString('utf8'));
    return;
  }
  if (testing) {
    return;
  }
  testing = true;
  console.log('Pa11y: running tests...');

  const actions = config.urls.map((test, i) => () => {
    console.log(`  checking ${test.url}`);
    const screenCapture = filename(i);
    return pa11y(test.url, {
      ...defaults,
      screenCapture,
      ...test
    })
  });

  pAll(actions, {
    concurrency: CONCURRENT_TESTS
  }).then(results => {
    const total = {
      errors: 0,
      warnings: 0,
      notices: 0
    };

    console.log('');

    results.forEach(result => {
      if (result.documentTitle) {
        console.log(`results for "${result.documentTitle}"`);

        console.log(reporter.results(result));

        total.errors += result.issues.reduce((accumulator, issue) =>
          issue.type === 'error' ? accumulator + 1 : accumulator, 0);
        total.warnings += result.issues.reduce((accumulator, issue) =>
          issue.type === 'warning' ? accumulator + 1 : accumulator, 0);
        total.notices += result.issues.reduce((accumulator, issue) =>
          issue.type === 'notice' ? accumulator + 1 : accumulator, 0);
      }
    }, reason => {
      console.error(chalk.red('Pa11y: promise rejection:', reason));
      process.exit(1);
    });

    console.log('Pa11y: TOTALS found', (total.errors + total.warnings + total.notices));

    if (total.errors) {
      console.log(chalk.red('Pa11y: total errors', total.errors));
    }
    if (total.warnings) {
      console.log(chalk.yellow('Pa11y: total warnings', total.warnings));
    }
    if (total.notices) {
      console.log(chalk.cyan('Pa11y: total notices', total.notices));
    }

    console.log('');

    if (total.errors) {
      process.exit(1);
    }

    process.exit(0);
  }).catch(error => {
    console.error('Pa11y: error: ', error);
    process.exit(1);
  });
});
