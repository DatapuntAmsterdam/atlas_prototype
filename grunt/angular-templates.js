var modules = require('./config/modules'),
    ngTemplatesConfig = {};

modules.forEach(function (module) {
    ngTemplatesConfig[module.name] = {
        src: 'modules/' + module.slug + '/**/*.html',
        dest: 'build/temp/' + module.slug + '.ngtemplates.js'
    };
});

module.exports = ngTemplatesConfig;
