/*
    pa11y.js will start a dev server with npm start. When everything builds fine. It will start an aria test
    the config file contains all urls needed for testing to be successful.
    After running tests it will kill all processes involved.
*/

import pa11y from 'pa11y';
import reporter from 'pa11y-reporter-cli';
import chalk from 'chalk';

import { spawn } from 'child_process';
import config from './pa11y-config';

const npmStart = spawn('npm', ['start'], { detached: true });
const defaults = config.defaults || {};

let count = 0;

/* eslint-disable no-console, angular/log */
console.log('Pa11y testing...');
console.log('Pa11y: starting dev server...');
/* eslint-enable no-console, angular/log */

npmStart.stdout.on('data', (buffer) => {
    const test = buffer.toString('utf8').includes('Child html-webpack-plugin for "index.html"');

    if (test) {
        count++;
    }

    if (count < 2 || !test) {
        return;
    }

    const allTests = config.urls.map(item => pa11y(item.url, {
        ...defaults,
        ...item
    }));

    /* eslint-disable no-console, angular/log */
    console.log('Pa11y: running tests...');
    /* eslint-enable no-console, angular/log */

    Promise.all(allTests).then(results => {
        const total = {
            errors: 0,
            warnings: 0,
            notices: 0
        };

        results.forEach(result => {
            if (result.documentTitle) {
                /* eslint-disable no-console, angular/log */
                console.log(`Pa11y: testing item: ${result.documentTitle}`);
                /* eslint-enable no-console, angular/log */

                /* eslint-disable no-console, angular/log */
                console.log(reporter.results(result));
                /* eslint-enable no-console, angular/log */

                total.errors += result.issues.reduce((accumulator, issue) =>
                    issue.type === 'error' ? accumulator + 1 : accumulator, 0);
                total.warnings += result.issues.reduce((accumulator, issue) =>
                    issue.type === 'warning' ? accumulator + 1 : accumulator, 0);
                total.notices += result.issues.reduce((accumulator, issue) =>
                    issue.type === 'notice' ? accumulator + 1 : accumulator, 0);
            }
        }, reason => {
            /* eslint-disable no-console, angular/log */
            console.log(chalk.red('Pa11y: promise rejection:', reason));
            /* eslint-enable no-console, angular/log */

            process.kill(-npmStart.pid, 'SIGKILL');
            process.exit();
        });

        /* eslint-disable no-console, angular/log */
        console.log('Pa11y: TOTALS found ', (total.errors + total.warnings + total.notices));
        /* eslint-enable no-console, angular/log */

        if (total.errors) {
            /* eslint-disable no-console, angular/log */
            console.log(chalk.red('Pa11y: total errors', total.errors));
            /* eslint-enable no-console, angular/log */
        }
        if (total.warnings) {
            /* eslint-disable no-console, angular/log */
            console.log(chalk.yellow('Pa11y: total warnings', total.warnings));
            /* eslint-enable no-console, angular/log */
        }
        if (total.notices) {
            /* eslint-disable no-console, angular/log */
            console.log(chalk.cyan('Pa11y: total notices', total.notices));
            /* eslint-enable no-console, angular/log */
        }

        process.kill(-npmStart.pid, 'SIGKILL');
        process.exit();
    });
});
