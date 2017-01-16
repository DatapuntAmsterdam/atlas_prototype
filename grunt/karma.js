module.exports = function (grunt) {
    var files = require('./config/js-files');

    var targets = {
        options: {
            configFile: 'karma.conf.js'
        },
        all: {
            reporters: ['mocha']
        },
        coverage: {
            reporters: ['mocha', 'coverage']
        },
        fullcoverage: {
            reporters: ['mocha', 'coverage'],
            options: {
                coverageReporter: {
                    type: 'html',
                    dir: 'reports/coverage/',
                    check: {
                        global: {
                            statements: 100,
                            branches: 100,
                            functions: 100,
                            lines: 100
                        }
                    }
                }
            }
        }
        //
        // The code below generates targets as follows:
        // 'karma:${module.slug}_[all|coverage|fullcoverage]': {
        //     options: {
        //         files: [
        //             'build/temp/bower_components.js',
        //             files.moduleDependencies(module)
        //                 .map(mod => files.jsModuleFiles(mod))
        //                 .reduce((result, deps) => result.concat(deps), []),
        //             'bower_components/angular-mocks/angular-mocks.js',
        //             // BEGIN for all modules except shared:
        //             'modules/shared-mocks/shared-mocks.module.js'
        //             // END
        //             `build/temp/babel/es5tests/atlas.${module.slug}.js`
        //         ],
        //         exclude: [
        //             // BEGIN for all modules except shared:
        //             'modules/shared/components/link/*.js'
        //             // END
        //         ],
        //         preprocessors: {
        //             'modules/**/*.js': ['babel'],
        //             ['modules/' + module.slug + '**/*.js']: ['coverage'],
        //             'build/temp/babel/es5tests/*.js': ['sourcemap']
        //         }
        //     },
        //     reporters: ['mocha']
        // }
        //
        // As well as the tasks karma-modules-all and karma-modules-coverage to run the group of targets
        //
    };

    [
        { name: 'karma-modules-all', mainTarget: 'all' },
        { name: 'karma-modules-coverage', mainTarget: 'coverage' },
        { name: 'karma-modules-fullcoverage', mainTarget: 'fullcoverage' }
    ].forEach(task =>
        grunt.registerTask(task.name,
            files.modules.map(module => {
                var name = `${module.slug}_${task.mainTarget}`;
                var firstFiles = [
                    'build/temp/atlas.libs.js',
                    // Use the ES6 code as source; code coverage runs on the ES6 code
                    files.moduleDependencies(module)
                        .map(mod => files.jsTestModuleFiles(mod))
                        .reduce((result, deps) => result.concat(deps), [])
                ];
                var lastFiles = [
                    'bower_components/angular-mocks/angular-mocks.js',
                    // Use the ES5 tests and route the tests through sourcemap
                    `build/temp/babel/es5tests/atlas.${module.slug}.js`
                ];
                var mockFiles = [
                    'modules/shared-mocks/shared-mocks.module.js'
                ];
                var allFiles;
                var exclude = [];
                var mockExclude = [
                    'modules/shared/components/link/*.js'
                ];
                var allExclude;

                if (module.slug === 'shared') {
                    allFiles = firstFiles.concat(lastFiles);
                    allExclude = exclude;
                } else {
                    // Insert shared mocks for all modules, except the shared
                    // module itself
                    allFiles = firstFiles.concat(mockFiles, lastFiles);
                    // Exclude the shared components that have been mocked
                    allExclude = exclude.concat(mockExclude);
                }

                targets[name] = Object.assign(
                    {},
                    targets[task.mainTarget],
                    {
                        options: Object.assign(
                            {},
                            targets[task.mainTarget].options,
                            {
                                files: allFiles,
                                exclude: allExclude,
                                preprocessors: {
                                    ['modules/' + module.slug + '/**/!(*.test|*.page-objects).js']: ['coverage'],
                                    'modules/**/*.js': ['babel'],
                                    'build/temp/babel/es5tests/*.js': ['sourcemap']
                                }
                            })
                    }
                );

                return `karma:${name}`;
            })
    ));

    return targets;
};
