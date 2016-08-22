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
    },
    bower_fonts: {
        files: [
            {
                cwd: 'bower_components/',
                src: [
                    '**/*.eot',
                    '**/*.svg',
                    '**/*.ttf',
                    '**/*.woff',
                    '**/*.woff2',
                ],
                dest: 'build/',
                expand: true,
                flatten: true
            }
        ]
    }
};