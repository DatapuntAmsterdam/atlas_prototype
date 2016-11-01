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
        }
        //
        // The code below generates targets as follows:
        // all_${module.slug}: {
        //     options: {
        //         files: [
        //             'build/temp/bower_components.js',
        //             files.moduleDependencies(module)
        //                 .map(mod => files.jsModuleFiles(mod))
        //                 .reduce((result, deps) => result.concat(deps), []),
        //             'bower_components/angular-mocks/angular-mocks.js',
        //             `build/temp/babel/es5tests/atlas.${module.slug}.js`
        //         ],
        //         preprocessors: {
        //             'modules/**/*.js': ['babel'],
        //             ['modules/' + module.slug + '**/*.js']: ['coverage'],
        //             'build/temp/babel/es5tests/*.js': ['sourcemap']
        //         }
        //     },
        //     reporters: ['mocha']
        // },
        // coverage_${module.slug}: {
        //     options: {
        //         files: [
        //             'build/temp/bower_components.js',
        //             files.moduleDependencies(module)
        //                 .map(mod => files.jsModuleFiles(mod))
        //                 .reduce((result, deps) => result.concat(deps), []),
        //             'bower_components/angular-mocks/angular-mocks.js',
        //             `build/temp/babel/es5tests/atlas.${module.slug}.js`
        //         ],
        //         preprocessors: {
        //             'modules/**/*.js': ['babel'],
        //             ['modules/' + module.slug + '**/*.js']: ['coverage'],
        //             'build/temp/babel/es5tests/*.js': ['sourcemap']
        //         }
        //     },
        //     reporters: ['mocha', 'coverage']
        // },
        //
        // As well as the tasks karma-modules-all and karma-modules-coverage to run the group of targets
        //
    };

    [
        { name: 'karma-modules-all', mainTarget: 'all' },
        { name: 'karma-modules-coverage', mainTarget: 'coverage' }
    ].forEach(task =>
        grunt.registerTask(task.name,
            files.modules.map(module => {
                var name = `${module.slug}_${task.mainTarget}`;
                targets[name] = Object.assign(
                    {},
                    targets[task.mainTarget],
                    {
                        options: {
                            files: [
                                'build/temp/atlas.libs.js',
                                // Use the ES6 code as source; code coverage runs on the ES6 code
                                files.moduleDependencies(module)
                                    .map(mod => files.jsModuleFiles(mod))
                                    .reduce((result, deps) => result.concat(deps), []),
                                'bower_components/angular-mocks/angular-mocks.js',
                                // Use the ES5 tests and route the tests through sourcemap
                                `build/temp/babel/es5tests/atlas.${module.slug}.js`
                            ],
                            preprocessors: {
                                ['modules/' + module.slug + '/**/!(*.test).js']: ['coverage'],
                                'modules/**/*.js': ['babel'],
                                'build/temp/babel/es5tests/*.js': ['sourcemap']
                            }
                        }
                    }
                );
                return `karma:${name}`;
            })
    ));

    return targets;
};
