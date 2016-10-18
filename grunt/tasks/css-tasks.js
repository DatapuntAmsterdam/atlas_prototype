module.exports = function (grunt) {
    /**
     * The output of build-css are two files 'build/atlas.css' and a source map.
     */
    grunt.registerTask('build-css', [
        'bower_concat:css',
        'update-build-css'
    ]);

    grunt.registerTask('update-build-css', [
        'sass',
        'concat:css',
        'postcss',
        'tags:css'
    ]);
};
