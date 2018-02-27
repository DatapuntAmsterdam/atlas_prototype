/*
 * pa11y.js tests all the URLs in the config file.
 * All URL tests need to succeed for the entire test to succeed.
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

const checkActions = () => {
  // flatten actions
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

console.log('Pa11y: running tests...');

const defaults = config.defaults;
const actions = config.urls.map((test, i) => () => {
  let url = test.url;
  if (process.env.BASE_URL) {
    url = url.replace('http://localhost:8080', process.env.BASE_URL);
  }

  console.log(`checking ${url}`);
  const screenCapture = filename(i);
  return pa11y(url, {
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
