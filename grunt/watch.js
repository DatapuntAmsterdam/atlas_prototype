var files = require('./config/js-files');

var targets = {
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
    grunt: {
        files: ['Gruntfile.js', 'grunt/**/*'],
        tasks: ['eslint:grunt'],
        options: {
            reload: true
        }
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
    //
    // The code below generates targets as follows
    // `module_${module.slug}`:_{
    //     files: [
    //         `modules/${module.slug}/**/!(*.test).js`,
    //         `modules/${module.slug}/**/*.html`
    //     ],
    //     tasks: [
    //         'clean:js',
    //         `build-js-module-${module.slug}`,
    //         'update-build-js',
    //         `test-js-module-${module.slug}`
    //     ]
    // }
    // `test_${module.slug}` = {
    //     files: [
    //         `modules/${module.slug}/**/*.test.js`
    //     ],
    //     tasks: [
    //         `test-js-module-${module.slug}`
    //     ]
    // }
    //
};

files.modules
    .forEach(module => {
        // Module js or html has changed
        targets[`module_${module.slug}`] = {
            files: [
                `modules/${module.slug}/**/!(*.test).js`,
                `modules/${module.slug}/**/*.html`
            ],
            tasks: [
                'clean:js',
                `build-js-module-${module.slug}`,
                'update-build-js',
                `test-js-module-${module.slug}`
            ]
        };

        // Module test has changed
        targets[`test_${module.slug}`] = {
            files: [
                `modules/${module.slug}/**/*.test.js`
            ],
            tasks: [
                `plain-test-js-module-${module.slug}`
            ],
            options: {
                'spawn': false
            }
        };
    });

module.exports = targets;
