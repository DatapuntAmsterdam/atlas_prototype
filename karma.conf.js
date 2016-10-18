module.exports = function (config) {
    var jsFiles = ['build/temp/bower_components.js'];
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
            'modules/**/!(*.test).js': ['babel', 'coverage'],
            'build/temp/babel/es5tests/*.js': ['sourcemap']
        },
        babelPreprocessor: {
            options: {
                presets: ['es2015'],
                compact: false
            }
        },
        mochaReporter: {
            output: 'minimal'
        },
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
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
