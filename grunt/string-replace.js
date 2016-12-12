module.exports = function (grunt) {
    var targets = {
        dist: {
            files: [{
                src: 'modules/atlas/atlas.version.js.template',
                dest: 'modules/atlas/atlas.version.js'
            }],
            options: {
                replacements: [{
                    pattern: '__BUILDID__',
                    replacement: grunt.option('buildid')
                }]
            }
        }
    };

    return targets;
};
