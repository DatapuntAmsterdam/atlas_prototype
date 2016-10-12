module.exports = {
    grunt: {
        src: ['.eslintrs.js', 'Gruntfile.js', 'grunt/**/*.js']
    },
    modules: {
        src: ['.eslintrs.js', 'modules/**/!(*.test).js']
    },
    tests: {
        src: ['.eslintrs.js', 'modules/**/*.test.js']
    }
};
