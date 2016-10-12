module.exports = function (grunt) {
    /**
     * The output of build-js are two files 'build/atlas.js' and a source map.
     */
    grunt.registerTask('build-js', [
        'build-js-lib',
        'update-build-js'
    ]);

    grunt.registerTask('update-build-js', [
        'copy:bower',    // copy bower, do not rebuild bower
        'build-js-modules',
        'tags:js'
    ]);

    grunt.registerTask('build-js-lib', [
        'npmcopy',          // build temp/npm_components
        'bower_concat:js',  // build temp/bower_components
        'concat:npm_bower'  // combine npm and bower components into one js file
    ]);

    grunt.registerTask('build-js-modules', [
        'newer:ngtemplates',
        'concat:modules',
        'babel-modules-configure',
        'babel:modules'
    ]);
};
