module.exports = {
    options: {
        html5Mode: false,
        title: 'Atlas API reference',
        dest: 'build/docs',
        startPage: 'api/atlas.module:atlas',
        sourceLink: false,
        editLink: false,
        editExample: false
    },
    all: [
        'modules/**/*.js'
    ]
};
