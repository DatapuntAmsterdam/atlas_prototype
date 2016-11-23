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
        'concat:libs'       // combine npm and bower components into one js file
    ]);

    grunt.registerTask('build-js-modules', [
        'ngtemplates'      // html to javascript
    ]);

    // The following tasks are a per-module version of the build-js-modules task
    files.modules.forEach(module => {
        grunt.registerTask(`build-js-module-${module.slug}`, [
            `newer:ngtemplates:${module.name}`
        ]);
    });

    grunt.registerTask('update-build-js', [
        'copy:libs',
        'concat:modules',
        'babel-concat-modules',
        'tags:js'           // update the script names in index.html
    ]);
};
