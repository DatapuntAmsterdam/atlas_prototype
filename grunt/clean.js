module.exports = {
    build: {
        src: 'build'
    },
    temp: {
        src: 'build/temp'
    },
    js: {
        src: [
            'build/atlas.*.js',
            'build/atlas.*.js.map',
            'build/temp/es6'
        ]
    },
    css: {
        src: [
            'build/atlas.*.css',
            'build/atlas.*.css.map'
        ]
    }
};
