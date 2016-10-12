module.exports = {
    options: {
        configFile: 'karma.conf.js'
    },
    all: {
        reporters: ['mocha']
    },
    coverage: {
        reporters: ['mocha', 'coverage']
    }
};
