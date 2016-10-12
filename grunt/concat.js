module.exports = function (grunt) {
    var jsFiles = require('./config/js-files'),
        cssFiles = require('./config/css-files'),
        uniqueIdJs,
        uniqueIdCss;

    uniqueIdJs = grunt.config.get('uniqueIdJs');
    uniqueIdCss = grunt.config.get('uniqueIdCss');

    return {
        options: {
            sourceMap: true
        },
        npm_bower: {
            options: {
                sourceMap: false    // Generating source maps is an expensive operation...
            },
            // Treat npm "bower" components as regular bower components...
            src: ['build/temp/npm_components/**/*.js', 'build/temp/bower_components/bower_components.js'],
            dest: 'build/temp/bower_components.js'
        },
        tests: {
            src: ['modules/**/*.test.js'],
            dest: 'build/temp/babel/atlas.tests.es6.js'
        },
        modules: {
            src: jsFiles,
            dest: 'build/temp/babel/atlas.' + uniqueIdJs + '.js'
        },
        css: {
            src: cssFiles,
            dest: 'build/atlas.' + uniqueIdCss + '.css'
        }
    };
};
