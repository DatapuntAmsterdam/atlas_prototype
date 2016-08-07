module.exports = {
    options: {
        compact: true,
        sourceMap: true,
        presets: ['es2015']
    },
    dist: {
        files: {
            'build/temp/babel-output-atlas.js': 'build/temp/concat-atlas.js'
        }
    }
};