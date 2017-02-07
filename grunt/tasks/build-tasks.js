module.exports = function (grunt) {
    grunt.registerTask('build-develop', [
        'clean:build',

        'copy:index',
        'copy:assets',
        'copy:bower_bbga_fonts',
        'copy:bower_leaflet_images',

        'build-js',
        'build-css'
    ]);

    grunt.registerTask('build-release', [
        'build-develop',
        'build-test',
        'karma-modules-fullcoverage',
        'clean:temp'
    ]);

    grunt.registerTask('set-build-id', function () {
        if (grunt.option('buildid')) {
            grunt.task.run(['string-replace']);
        } else {
            grunt.log.error('Usage: grunt set-build-id --buildid=<buildid>');
        }
    });
};
