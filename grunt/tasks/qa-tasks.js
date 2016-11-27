module.exports = function (grunt) {
    var files = require('../config/js-files');

    // Configure lint tasks
    const linters = ['eslint', 'console-log-test'];
    const tasks = ['grunt', 'tests', 'modules'];
    const linttasks = linters
        .map(linter => tasks
            .map(task => `${linter}:${task}`))
        .reduce((result, lintertasks) => result.concat(lintertasks), []);

    grunt.registerTask('lint', linttasks);

    grunt.registerTask('test-js', [
        'test-js-modules',
        'lint'
    ]);

    grunt.registerTask('test-js-full', [
        'test-js-modules-full',
        'lint'
    ]);

    grunt.registerTask('test-css', [
        'sasslint'
    ]);

    grunt.registerTask('build-test', [
        'concat-tests',
        'babel-tests'
    ]);

    grunt.registerTask('test-js-modules', [
        'build-test',
        'karma-modules-coverage'
    ]);

    grunt.registerTask('test-js-modules-full', [
        'build-test',
        'karma-modules-fullcoverage'
    ]);

    // Test a single module by concatenate the test files
    // have them transpiled
    // And then run karma
    // The tasks are a per-module version of the test-js task
    // A Taiga task has been made to have all modules tested with full coverage
    files.modules.forEach(module => {
        grunt.registerTask(`test-js-module-${module.slug}`,
            [
                `concat:test_${module.slug}`,
                `babel-test-${module.slug}`,
                `karma:${module.slug}_all`
            ].concat(linters.map(linter => `newer:${linter}:module_${module.slug}`))
        );
    });

    grunt.registerTask('pre-commit', [
    ]);
};
