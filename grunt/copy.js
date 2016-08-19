module.exports = {
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
    }
};