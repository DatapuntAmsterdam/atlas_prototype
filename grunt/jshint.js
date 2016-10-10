module.exports = {
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    },
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