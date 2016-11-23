module.exports = function (grunt) {
    var files = require('./config/js-files'),
        cssFiles = require('./config/css-files'),
        uniqueIdJs = grunt.config.get('uniqueIdJs'),
        uniqueIdCss = grunt.config.get('uniqueIdCss');

    var targets = {
        options: {
            sourceMap: true
        },
        libs: {
            options: {
                sourceMap: false
            },
            // Treat npm "bower" components as regular bower components...
            src: ['build/temp/npm_components/**/*.js', 'build/temp/bower_components/bower_components.js'],
            dest: 'build/temp/atlas.libs.js'
        },
        css: {
            src: cssFiles,
            dest: 'build/atlas.' + uniqueIdCss + '.css'
        },
        modules: {
            src: files.jsFiles,
            dest: 'build/temp/es6/atlas.' + uniqueIdJs + '.js'
        }
        //
        // The code below generates targets as follows
        // `module_${module.slug}`:_{
        //     src: files.jsModuleFiles(module),
        //     dest: `build/temp/babel/es6/atlas.${module.slug}.js`
        // }
        // `test_${module.slug}`:_{
        //     src: files.jsModuleFiles(module),
        //     dest: `build/temp/babel/es6tests/atlas.${module.slug}.js`
        // }
        //
        // As well as the tasks concat-modules and concat-tests to run the group of targets
    };

    var moduleTarget = module => {
        return {
            name: `module_${module.slug}`,
            src: files.jsModuleFiles(module),
            dest: `build/temp/es6/atlas.${module.slug}.js`
        };
    };

    var testTarget = module => {
        return {
            name: `test_${module.slug}`,
            src: [`modules/${module.slug}/**/*.test.js`],
            dest: `build/temp/babel/es6tests/atlas.${module.slug}.js`
        };
    };

    var setTarget = target => {
        targets[target.name] = { src: target.src, dest: target.dest };
        return target;
    };

    [
        { name: 'concat-modules', target: moduleTarget },
        { name: 'concat-tests', target: testTarget }
    ].forEach(task =>
        grunt.registerTask(task.name,
            files.modules
                .map(module => task.target(module))
                .map(target => setTarget(target))
                .map(target => `${task.newer ? 'newer:' : ''}concat:${target.name}`)));

    return targets;
};
