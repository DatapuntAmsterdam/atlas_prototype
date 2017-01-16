var files = require('./config/js-files');

var targets = {
    css: {
        files: [
            'modules/**/*.scss',
            '!modules/shared/styles/config/mixins/_icons.scss'
        ],
        tasks: [
            'clean:css',
            'update-build-css',
            'test-css'
        ]
    },
    icons: {
        files: 'modules/shared/assets/svg-icons/**/*',
        tasks: [
            'clean:css',
            'clean:icons',
            'svg_sprite',
            'update-build-css'
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
        files: [
            'modules/shared/assets/**/*',
            '!modules/shared/assets/svg-icons/**/*'
        ],
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
                `modules/${module.slug}/**/!(*.test|*.page-objects).js`,
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
                `test-js-module-${module.slug}`
            ]
        };
    });

module.exports = targets;
