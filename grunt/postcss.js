module.exports = function (grunt) {
    var uniqueIdCss = grunt.config.get('uniqueIdCss');

    return {
        options: {
            map: true,
            processors: [
                require('autoprefixer')({browsers: 'last 2 versions'})
            ]
        },
        dist: {
            src: 'build/atlas.' + uniqueIdCss + '.css'
        }
    };
};
