var modules = require('./config/modules'),
    sassConfig = {};

modules.forEach(function (module) {
    var filesConfig = {};

    filesConfig['build/temp/' + module.slug + '.css'] = [
        'modules/' + module.slug + '/' + module.slug + '.scss'
    ];

    sassConfig[module.slug] = {
        files: filesConfig
    };
});

module.exports = sassConfig;
