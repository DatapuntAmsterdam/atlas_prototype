module.exports = function () {
    var files = require('./config/js-files');

    var targets = {
        grunt: {
            src: ['Gruntfile.js', 'grunt/**/*.js']
        },
        modules: {
            src: ['modules/**/!(*.test).js']
        },
        tests: {
            src: ['modules/**/*.test.js']
        }
    };

    files.modules.forEach(module => {
        targets[`module_${module.slug}`] = {
            src: [`modules/${module.slug}/**/*.js`]
        };
    });

    return targets;
};
