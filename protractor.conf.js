exports.config = {
    framework: 'jasmine',
    specs: 'e2e/*.test.js',
    capabilities: {
        browserName: 'phantomjs',
        'phantomjs.binary.path': './node_modules/phantomjs/bin/phantomjs'
    }
};
