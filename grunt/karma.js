module.exports = {
    options: {
        configFile: 'karma.conf.js'
    },
    all: {
        reporters: ['mocha']
    },
    coverage: {
        reporters: ['mocha', 'coverage']
    },
    babel: {
        options: {
            files: ['build/temp/npm_components/**/*.js', 'babel.tests.js'],
            preprocessors: {
                'babel.tests.js': ['babel']
            },
        },
        reporters: ['mocha']
    }
};