var modules = require('./modules'),
    jsFilesAtlas = [],
    jsFilesVendor = ['build/temp/bower_components.js'];

modules.forEach(function (module) {
    //Add the main .module.js file first
    jsFilesAtlas.push('modules/' + module.slug + '/' + module.slug + '.module.js');

    //Then load the rest of the module, but don't include the .test.js files.
    jsFilesAtlas.push('modules/' + module.slug + '/**/*.js');
    jsFilesAtlas.push('!modules/' + module.slug + '/**/*.test.js');

    //And finally add the output of ngtemplates
    jsFilesAtlas.push('build/temp/' + module.slug + '.ngtemplates.js');
});

module.exports = {
    atlas: jsFilesAtlas,
    vendor: jsFilesVendor
};