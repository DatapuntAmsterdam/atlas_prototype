module.exports = function (grunt) {
    var files = require('../config/js-files');

    /**
     * The output of build-js are two files 'build/atlas.js' and a source map.
     */
    grunt.registerTask('build-js', [
        'build-js-lib',
        'build-js-modules',
        'update-build-js'
    ]);

    grunt.registerTask('build-js-lib', [
        'npmcopy',          // build temp/npm_components
        'bower_concat:js',  // build temp/bower_components
        'concat:npm_bower'  // combine npm and bower components into one js file
    ]);

    grunt.registerTask('build-js-modules', [
        'ngtemplates',      // html to javascript
        'concat-modules',   // concat each module
        'babel-modules'     // transpile each module
    ]);

    // The following tasks are a per-module version of the build-js-modules task
    files.modules.forEach(module => {
        grunt.registerTask(`build-js-module-${module.slug}`, [
            `newer:ngtemplates:${module.name}`,
            `concat:module_${module.slug}`,
            `babel-module-${module.slug}`
        ]);
    });

    grunt.registerTask('update-build-js', [
        'copy:bower',
        'copy:app',
        'tags:jsModules'    // update the script names in index.html
    ]);
};
