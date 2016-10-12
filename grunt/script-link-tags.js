module.exports = function (grunt) {
    var uniqueIdJs = grunt.config.get('uniqueIdJs'),
        uniqueIdCss = grunt.config.get('uniqueIdCss');

    return {
        options: {
            scriptTemplate: '<script src="{{path}}"></script>',
            linkTemplate: '<link rel="stylesheet" href="{{path}}">'
        },
        js: {
            options: {
                openTag: '<!-- SCRIPTS_START -->',
                closeTag: '<!-- SCRIPTS_END -->'
            },
            src: ['build/atlas.libs.' + uniqueIdJs + '.js', 'build/atlas.' + uniqueIdJs + '.js'],
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
