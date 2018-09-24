import reduxWatch from '../../src/shared/services/redux-watcher/redux-watcher';

const templates = require.context('..', true, /\.html$/);

(function () {
    'use strict';

    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = ['$templateCache', 'store', 'ATLAS_VERSION'];

    function runBlock ($templateCache, store, atlasVersion) {
        templates.keys().forEach((key) => {
            // Remove the dot from './dir/template.html' and prepend with
            // 'modules' to get 'modules/dir/template.html'.
            const templateId = 'modules' + key.substr(1);
            $templateCache.put(templateId, templates(key));
        });

        reduxWatch(store);

        console.log( // eslint-disable-line no-console, angular/log
            `CityData: version: ${atlasVersion.version}, build: ${atlasVersion.build}`
        );
    }
})();
