module.exports = function (grunt) {
    // Configure lint tasks
    const linters = ['eslint', 'console-log-test'];
    const tasks = ['grunt', 'tests', 'modules'];

    const linttasks = linters
        .map(linter => tasks
            .map(task => `newer:${linter}:${task}`))
        .reduce((result, lintertasks) => result.concat(lintertasks), []);

    grunt.registerTask('lint', linttasks);

    grunt.registerTask('test-js', [
        'lint',
        'test-js-modules'
    ]);

    grunt.registerTask('test-css', [
        'sasslint'
    ]);

    grunt.registerTask('test-js-modules', [
        'newer:concat:tests',
        'babel-tests-configure',
        'newer:babel:tests',
        'karma:coverage'
    ]);
};
