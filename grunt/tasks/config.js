module.exports = function (grunt) {

    const gruntDir = '../';
    const timeGrunt = false;

    if (timeGrunt) {
        // Provides timing information about grunt tasks
        require('time-grunt')(grunt);
    }

    var shortid = require('shortid');

    /**
     * An ID that is unique for each build to prevent browser caching. This needs to be set before the other
     * configuration which relies on this ID.
     */
    grunt.config.set('uniqueIdJs', shortid.generate());
    grunt.config.set('uniqueIdCss', shortid.generate());

    grunt.initConfig({
        babel: require(gruntDir + 'babel')(grunt),
        bower_concat: require(gruntDir + 'bower-concat'),
        clean: require(gruntDir + 'clean'),
        concat: require(gruntDir + 'concat')(grunt),
        connect: require(gruntDir + 'connect'),
        'console-log-test': require(gruntDir + 'lint')('console-log-test'),
        copy: require(gruntDir + 'copy')(grunt),
        eslint: require(gruntDir + 'lint')('eslint'),
        karma: require(gruntDir + 'karma')(grunt),
        ngdocs: require(gruntDir + 'ngdocs'),
        ngtemplates: require(gruntDir + 'angular-templates'),
        npmcopy: require(gruntDir + 'npmcopy'),
        postcss: require(gruntDir + 'postcss')(grunt),
        sass: require(gruntDir + 'sass'),
        sasslint: require(gruntDir + 'sasslint'),
        tags: require(gruntDir + 'script-link-tags')(grunt),
        watch: require(gruntDir + 'watch')
    });

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-console-log-test');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-npmcopy');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-script-link-tags');
};
