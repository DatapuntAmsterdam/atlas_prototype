module.exports = function (grunt) {
    var files = require('./config/js-files');
    var uniqueIdJs = grunt.config.get('uniqueIdJs');

    return {
        index: {
            src: ['index.html'],
            dest: 'build/index.html'
        },
        assets: {
            files: [
                {
                    cwd: 'modules/shared/assets/',
                    src: '**/*',
                    dest: 'build/assets/',
                    expand: true,
                    flatten: false
                }
            ]
        },
        bower: {
            src: ['build/temp/bower_components.*'],
            dest: 'build/',
            expand: true,
            flatten: true,
            rename: function (dest, src) {
                return dest + src.replace(/bower_components/g, `atlas.${uniqueIdJs}.libs`);
            }
        },
        app: {
            src: files.modules.map(module => `build/temp/babel/es5/atlas.${module.slug}.*`),
            dest: 'build/',
            expand: true,
            flatten: true,
            rename: function (dest, src) {
                return dest + src.replace(/atlas\./, `atlas.${uniqueIdJs}.`);
            }
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
