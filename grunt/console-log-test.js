module.exports = {
    grunt: {
        src: ['Gruntfile.js', 'grunt/**/*.js']
    },
    modules: {
        src: ['modules/**/!(*.test).js']
    },
    tests: {
        src: ['modules/**/*.test.js']
    }
};
