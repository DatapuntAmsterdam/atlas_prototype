module.exports = function (grunt) {
    var files = require('./config/js-files'),
        uniqueIdJs = grunt.config.get('uniqueIdJs');

    grunt.registerTask('babel-concat-modules', 'Configure babel options', function () {
        // Inject the source maps from the modules concat operation in the new babel sourcemap
        grunt.config.set('babel.modules.options.inputSourceMap',
            grunt.file.readJSON('build/temp/es6/atlas.' + uniqueIdJs + '.js.map'));
        grunt.task.run('babel:modules');
    });

    var targets = {
        options: {
            sourceMap: true,
            compact: false,
            minified: false,
            presets: ['es2015']
        },
        modules: {
            options: {
                // This option will be set by the babel-concat-modules task
            },
            files: [{
                expand: true,
                flatten: true,
                src: ['build/temp/es6/atlas.' + uniqueIdJs + '.js'],
                dest: 'build/'
            }]
        }
        //
        // The code below generates targets as follows
        // `transpile_module_${module.slug}`:_{
        //     options: {
        //         inputSourceMap: grunt.file.readJSON(`build/temp/babel/es6/atlas.${module.slug}.js.map`),
        //     },
        //     files: [{
        //         expand: true,
        //         flatten: true,
        //         src: `build/temp/babel/es6/atlas.${module.slug}.js`,
        //         dest: 'build/temp/babel/es5/'
        //     }]
        // },
        // `transpile_test_${module.slug}`:_{
        //     options: {
        //         inputSourceMap: grunt.file.readJSON(`build/temp/babel/es6tests/atlas.${module.slug}.js.map`),
        //     },
        //     files: [{
        //         expand: true,
        //         flatten: true,
        //         src: `build/temp/babel/es6tests/atlas.${module.slug}.js`,
        //         dest: 'build/temp/babel/es5tests/'
        //     }]
        // }
        //
        // As well as the tasks babel-modules and babel-tests to run the group of targets
        //
    };

    var moduleTarget = module => {
        return {
            name: `transpile_module_${module.slug}`,
            task: `babel-module-${module.slug}`,
            src: `build/temp/es6/atlas.${module.slug}.js`,
            dest: `build/atlas.${uniqueIdJs}.${module.slug}.js`
        };
    };

    var testTarget = module => {
        return {
            name: `transpile_test_${module.slug}`,
            task: `babel-test-${module.slug}`,
            src: `build/temp/babel/es6tests/atlas.${module.slug}.js`,
            dest: 'build/temp/babel/es5tests/'
        };
    };

    var setTarget = target => {
        targets[target.name] = {
            options: {
            },
            files: [{
                expand: true,
                flatten: true,
                src: target.src,
                dest: target.dest
            }]
        };
        return target;
    };

    var setTask = target => {
        grunt.registerTask(target.task, 'Configure babel module and run', function () {
            // Inject the source maps from the modules concat operation in the new babel sourcemap
            grunt.config.set(`babel.${target.name}.options.inputSourceMap`,
                grunt.file.readJSON(`${target.src}.map`));
            // Then run the target
            grunt.task.run(`babel:${target.name}`);
        });
        return target;
    };

    [
        { name: 'babel-modules', target: moduleTarget },
        { name: 'babel-tests', target: testTarget }
    ].forEach(task =>
        grunt.registerTask(task.name,
            files.modules
                .map(module => task.target(module))
                .map(target => setTarget(target))
                .map(target => setTask(target))
                .map(target => target.task)));

    return targets;
};
