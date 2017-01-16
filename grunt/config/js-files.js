var modules = require('./modules');

var jsModuleFiles = module => [
    `modules/${module.slug}/${module.slug}.module.js`,
    `modules/${module.slug}/**/!(*.test|*.page-objects).js`,
    `build/temp/${module.slug}.ngtemplates.js`
];

var jsTestModuleFiles = module => [
    `modules/${module.slug}/${module.slug}.module.js`,
    `modules/${module.slug}/**/!(*.test|*.page-objects|*.run).js`,
    `build/temp/${module.slug}.ngtemplates.js`
];

var cssModuleFiles = module => [
    `build/temp/${module.slug}.css`
];

var jsFiles = modules
    .map(module => jsModuleFiles(module))
    .reduce((result, files) => result.concat(files), []);

var cssFiles = modules
    .map(module => cssModuleFiles(module))
    .reduce((result, files) => result.concat(files), ['build/temp/bower_components/bower_components.css']);

var moduleDependencies = (module) => {
    switch (module.slug) {
        case 'atlas':
            // Atlas depends on all modules
            return modules;
        case 'shared':
            // Shared is independent
            return modules.filter(mod => mod.slug === 'shared');
        default:
            // All other modules depend on shared and the module itself
            return modules.filter(mod => mod.slug === 'shared' || mod.slug === module.slug);
    }
};

module.exports = {
    modules,
    jsModuleFiles,
    jsTestModuleFiles,
    moduleDependencies,
    jsFiles,
    cssModuleFiles,
    cssFiles
};
