var jsFiles = require('./grunt/config/js-files'),
    jsKarmaFiles = ['build/atlas.js'];

jsKarmaFiles.push('bower_components/angular-mocks/angular-mocks.js');
jsKarmaFiles.push('modules/**/*.test.js');

module.exports = function (config) {
    config.set({
        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine-jquery', 'jasmine'],

        // list of files / patterns to load in the browser
        files: jsKarmaFiles,

        plugins: [
            'karma-jasmine-jquery',
            'karma-jasmine',
            'karma-mocha-reporter',
            'karma-coverage',
            'karma-phantomjs-launcher'
        ],

        // level of logging
        // possible values: OFF, ERROR, WARN, INFO, DEBUG
        logLevel: 'ERROR',

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Reporters
        // - dots
        // - progress
        // - junit
        // - growl
        // - coverage
        reporters: ['coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'modules/**/!(*.test).js': ['coverage']
        },

        // optionally, configure the reporter
        // type can also be 'cobertura' which should be understand by Jenkins
        coverageReporter: {
            type: 'html',
            dir: 'reports/coverage/',
            check: {
                global: {
                    statements: 95,
                    branches: 95,
                    functions: 95,
                    lines: 95
                }
            }
        },

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
