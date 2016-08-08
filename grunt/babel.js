module.exports = {
    options: {
        compact: true,
        sourceMap: true
    },
    dist: {
        files: {
            'build/temp/babel-output-atlas.js': 'build/temp/concat-atlas.js'
        }
    }
};