module.exports = function (grunt) {
    return {
        options: {
            compact: true,
            sourceMap: true,
            inputSourceMap: grunt.file.readJSON('build/temp/concat-atlas.js.map'),
            presets: ['es2015']
        },
        dist: {
            files: {
                'build/temp/babel-output-atlas.js': 'build/temp/concat-atlas.js'
            }
        }
    };
};