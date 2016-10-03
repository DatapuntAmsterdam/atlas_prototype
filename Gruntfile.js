module.exports = function (grunt) {
    var shortid = require('shortid');

    /**
     * An ID that is unique for each build to prevent browser caching. This needs to be set before the other
     * configuration which relies on this ID.
     */
    grunt.config.set('uniqueIdJs', shortid.generate());
    grunt.config.set('uniqueIdCss', shortid.generate());

    grunt.initConfig({
        bower_concat: require('./grunt/bower-concat'),
        clean: require('./grunt/clean'),
        concat: require('./grunt/concat')(grunt),
        connect: require('./grunt/connect'),
        'console-log-test': require('./grunt/console-log-test'),
        copy: require('./grunt/copy'),
        jshint: require('./grunt/jshint'),
        karma: require('./grunt/karma'),
        ngdocs: require('./grunt/ngdocs'),
        ngtemplates: require('./grunt/angular-templates'),
        postcss: require('./grunt/postcss')(grunt),
        sass: require('./grunt/sass'),
        sasslint: require('./grunt/sasslint'),
        tags: require('./grunt/script-link-tags')(grunt),
        watch: require('./grunt/watch')
    });

    grunt.registerTask('build-develop', [
        'clean:build',

        'copy:index',
        'copy:assets',
        'copy:bower_bbga_fonts',
        'copy:bower_leaflet_images',
        'copy:bower_leaflet_measure_images',

        'build-js',
        'build-css'
    ]);

    grunt.registerTask('build-release', [
        'build-develop',
        'clean:temp'
    ]);

    grunt.registerTask('test-js', [
        'jshint',
        'karma:coverage',
        'console-log-test'
    ]);

    grunt.registerTask('test-css', [
        'sasslint'
    ]);

    /**
     * The output of build-js are two files 'build/atlas.js' and a source map.
     */
    grunt.registerTask('build-js', [
        'bower_concat:js',
        'ngtemplates',
        'concat:js',
        'tags:js'
    ]);


    /**
     * The output of build-css are two files 'build/atlas.css' and a source map.
     */
    grunt.registerTask('build-css', [
        'bower_concat:css',
        'sass',
        'concat:css',
        'postcss',
        'tags:css'
    ]);


    /**
     * 'default' formerly known as 'grunt serve'
     */
    grunt.registerTask('default', [
        'build-develop',
        'connect:build',
        'watch'
    ]);

    grunt.registerTask('test', [
        'build-develop',
        'test-js',
        'test-css'
    ]);

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-console-log-test');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-script-link-tags');
};