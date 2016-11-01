module.exports = function (config) {
    var jsFiles = ['build/temp/atlas.libs.js'];
    jsFiles = jsFiles.concat(require('./grunt/config/js-files').jsFiles);
    jsFiles.push('bower_components/angular-mocks/angular-mocks.js');
    jsFiles.push('build/temp/babel/es5tests/*.js');

    config.set({
        frameworks: ['jasmine-jquery', 'jasmine'],
        files: jsFiles,
        exclude: [
            'modules/**/*.run.js'
        ],
        plugins: [
            'karma-jasmine-jquery',
            'karma-jasmine',
            'karma-mocha-reporter',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-babel-preprocessor',
            'karma-sourcemap-loader'
        ],
        // possible values: OFF, ERROR, WARN, INFO, DEBUG
        logLevel: 'ERROR',
        preprocessors: {
            'modules/**/!(*.test).js': ['coverage', 'babel'],
            'build/temp/babel/es5tests/*.js': ['sourcemap']
        },
        mochaReporter: {
            output: 'minimal'
        },
        coverageReporter: {
            type: 'html',
            dir: 'reports/coverage/',
            check: {
                global: {
                    statements: 90,
                    branches: 90,
                    functions: 90,
                    lines: 90
                }
            }
        },
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
