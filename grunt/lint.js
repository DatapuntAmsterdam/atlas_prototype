module.exports = function () {
    var files = require('./config/js-files');

    var targets = {
        grunt: {
            src: ['Gruntfile.js', 'grunt/**/*.js']
        },
        modules: {
            src: ['modules/**/!(*.test|*.page-objects).js']
        },
        tests: {
            src: ['e2e/**/*.js', 'modules/**/*.test.js', 'modules/**/*.page-objects.js']
        }
    };

    files.modules.forEach(module => {
        targets[`module_${module.slug}`] = {
            src: [`modules/${module.slug}/**/*.js`]
        };
    });

    return targets;
};
