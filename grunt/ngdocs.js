module.exports = {
    options: {
        html5Mode: false,
        title: 'Atlas API reference',
        dest: 'build/docs',
        startPage: 'api/atlas.module:atlas'
    },
    all: [
        'modules/**/*.js'
    ]
};
