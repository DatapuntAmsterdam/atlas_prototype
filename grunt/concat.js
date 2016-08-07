var jsFiles = require('./config/js-files'),
    cssFiles = require('./config/css-files'),
    jsAll = [],
    concatConfig;

jsAll.push(jsFiles.vendor);
jsAll.push('build/temp/babel-output-atlas.js');

concatConfig = {
    options: {
        sourceMap: true
    },
    jsAtlas: {
        src: jsFiles.atlas,
        dest: 'build/temp/concat-atlas.js'
    },
    jsAll: {
        src: jsAll,
        dest: 'build/atlas.js'
    },
    css: {
        src: cssFiles,
        dest: 'build/atlas.css'
    }
};

module.exports = concatConfig;
