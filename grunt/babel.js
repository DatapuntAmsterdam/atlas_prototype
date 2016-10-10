module.exports = function (grunt) {

    var uniqueIdJs = grunt.config.get('uniqueIdJs');

    grunt.registerTask('babel-tests-configure', 'Configure babel tests options', function() {
        // Inject the source maps from the teste concat operation in the new babel sourcemap
        grunt.config.set('babel.tests.options.inputSourceMap',
            grunt.file.readJSON('build/temp/babel/atlas.tests.es6.js.map'));
    });

    grunt.registerTask('babel-modules-configure', 'Configure babel options', function() {
        // Inject the source maps from the modules concat operation in the new babel sourcemap
        grunt.config.set('babel.modules.options.inputSourceMap',
            grunt.file.readJSON('build/temp/babel/atlas.' + uniqueIdJs + '.js.map'));
    });

    return {
        options: {
            sourceMap: true,
            compact: false,
            presets: ['es2015']
        },
        tests: {
            options: {
                // inputSourceMap: this file is not yet available, inject name after babel task has finished,
            },
            files: {
                'build/temp/babel/atlas.tests.es5.js': 'build/temp/babel/atlas.tests.es6.js'
            }
        },
        modules: {
            options: {
                // inputSourceMap: this file is not yet available, inject name after babel task has finished,
            },
            files: [{
                expand: true,
                flatten: true,
                src: ['build/temp/babel/atlas.' + uniqueIdJs + '.js'],
                dest: 'build/'
            }]
        }
    };
};