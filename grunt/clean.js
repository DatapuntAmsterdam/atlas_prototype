module.exports = {
    build: {
        src: [
            'build',
            'modules/shared/styles/config/mixins/_icons.scss'
        ]
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
    },
    icons: {
        src: [
            'build/assets/images/icons*.svg',
            'modules/shared/styles/config/mixins/_icons.scss'
        ]
    }
};
