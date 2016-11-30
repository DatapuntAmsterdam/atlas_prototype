module.exports = function (grunt) {
    var uniqueIdJs = grunt.config.get('uniqueIdJs');

    return {
        index: {
            src: ['index.html', 'favicon.png'],
            dest: 'build/'
        },
        assets: {
            files: [
                {
                    cwd: 'modules/shared/assets/',
                    src: [
                        '**/*',
                        '!svg-icons',
                        '!svg-icons/**/*'
                    ],
                    dest: 'build/assets/',
                    expand: true,
                    flatten: false
                }
            ]
        },
        libs: {
            src: 'build/temp/atlas.libs.js',
            dest: `build/atlas.${uniqueIdJs}.libs.js`
        },
        bower_bbga_fonts: {
            files: [
                {
                    cwd: 'bower_components/bbga_visualisatie_d3/',
                    src: [
                        '**/*.eot',
                        '**/*.svg',
                        '**/*.ttf',
                        '**/*.woff',
                        '**/*.woff2'
                    ],
                    dest: 'build/',
                    expand: true,
                    flatten: true
                }
            ]
        },
        bower_leaflet_images: {
            files: [
                {
                    cwd: 'bower_components/leaflet/dist/images',
                    src: [
                        '**/*.png'
                    ],
                    dest: 'build/assets',
                    expand: true
                }
            ]
        },
        bower_leaflet_measure_images: {
            files: [
                {
                    cwd: 'bower_components/leaflet-measure/dist/',
                    src: [
                        '**/*.png'
                    ],
                    dest: 'build/',
                    expand: true,
                    flatten: false
                }
            ]
        }
    };
};
