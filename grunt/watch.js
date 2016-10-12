module.exports = {
    js_app: {
        files: [
            'modules/**/!(*.test).js',
            'modules/**/*.html'
        ],
        tasks: [
            'clean:js',
            'update-build-js',
            'test-js'
        ]
    },
    css: {
        files: [
            'modules/**/*.scss'
        ],
        tasks: [
            'clean:css',
            'update-build-css',
            'test-css'
        ]
    },
    js_tests: {
        files: [
            'modules/**/*.test.js'
        ],
        tasks: [
            'test-js'
        ]
    },
    static: {
        files: [
            'index.html'
        ],
        tasks: [
            'build-develop'
        ]
    },
    assets: {
        files: 'modules/shared/assets/**/*',
        tasks: ['copy:assets']
    },
    livereload: {
        options: {
            livereload: true
        },
        files: [
            'build/**/*',
            '!build/temp/**/*'
        ]
    }
};
