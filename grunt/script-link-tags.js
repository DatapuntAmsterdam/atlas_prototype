module.exports = function (grunt) {
    var files = require('./config/js-files');

    var uniqueIdJs = grunt.config.get('uniqueIdJs'),
        uniqueIdCss = grunt.config.get('uniqueIdCss');

    return {
        options: {
            scriptTemplate: '<script src="{{path}}"></script>',
            linkTemplate: '<link rel="stylesheet" href="{{path}}">'
        },
        jsModules: {
            options: {
                openTag: '<!-- SCRIPTS_START -->',
                closeTag: '<!-- SCRIPTS_END -->'
            },
            src: [`build/atlas.${uniqueIdJs}.libs.js`]
                .concat(files.modules
                    .map(module => `build/atlas.${uniqueIdJs}.${module.slug}.js`)),
            dest: 'build/index.html'
        },
        css: {
            options: {
                openTag: '<!-- STYLESHEETS_START -->',
                closeTag: '<!-- STYLESHEETS_END -->'
            },
            src: ['build/atlas.' + uniqueIdCss + '.css'],
            dest: 'build/index.html'
        }
    };
};
