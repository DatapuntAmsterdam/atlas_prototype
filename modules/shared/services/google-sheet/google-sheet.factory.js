(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('googleSheet', googleSheetFactory);

    googleSheetFactory.$inject = ['$q', '$window', '$sce', 'environment', 'api', 'markdownParser', 'GOOGLE_SHEET_CMS'];

    function googleSheetFactory ($q, $window, $sce, environment, api, markdownParser, GOOGLE_SHEET_CMS) {
        const sheets = {};    // local cache of parsed sheets

        return {
            getContents
        };

        function getContents (key, index) {
            const defer = $q.defer(),
                getSheet = GOOGLE_SHEET_CMS.getStatic[environment.NAME] ? getStaticSheet : getDynamicSheet;

            if (sheets[key] && sheets[key][index]) {
                defer.resolve(sheets[key][index]);  // resolves to the value or the promise
            } else {
                sheets[key] = sheets[key] || {};
                let result = {
                    feed: {
                        title: ''
                    },
                    entries: []
                };
                getSheet(key, index)
                    .then(contents => result = parseContents(contents))
                    .finally(
                        () => {
                            sheets[key][index] = result;
                            defer.resolve(sheets[key][index]);
                        });
            }

            return defer.promise;
        }

        function getStaticSheet (key, index) {
            // The 'static' version of the sheet is accessed by url
            // The contents is refreshed on a daily basis or on demand by a curl script that is run by Jenkins
            // Like curl https://spreadsheets.google.com/feeds/list/$KEY/$INDEX/public/basic?alt=json > [somefile]
            return api.getByUrl(`${GOOGLE_SHEET_CMS.staticAddress}/${key}.${index}.json`);
        }

        function getDynamicSheet (key, index) {
            // The 'dynamic' version of the sheet is accessed by calling a Google script from the head of the document
            // The script accepts a callback method to receive the contents in json format
            const defer = $q.defer(),
                callbackName = 'googleScriptCallback_' + key + '_' + index;

            $window[callbackName] = contents => defer.resolve(contents);

            // Create the script
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'https://spreadsheets.google.com/feeds/list/' +
                key +
                '/' +
                index +
                '/public/basic?alt=json-in-script&callback=' +
                callbackName;
            document.head.appendChild(script);

            return defer.promise;
        }

        function parseContents (contents) {
            const isDateValue = /(\d{1,2})-(\d{1,2})-(\d{4})/,
                isDateKey = /datum/i,
                isHref = /^(\[link |<a href=)/;

            // Set feed properties
            const feed = {
                title: contents.feed.title.$t,
                lastUpdated: contents.feed.updated.$t
            };

            // Extract entries
            const entries = contents.feed.entry.map((entry, id) => {
                // Extract the contents
                return entry.content.$t         // attrx: value, attry: value, ....
                    .replace(/^attr/, '')       // x: value, attry: value, ...
                    .split(/, attr/)            // [x:value, y:value, ...]
                    .map(keyValue => keyValue.split(/: ([^]*)/))    // [[x, value], [y, value], ...
                    .reduce((item, [key, value]) => {
                        // item.x = value, item.y = value, ...
                        if (angular.isDefined(value)) {
                            item[key] = {
                                value,
                                html: $sce.trustAsHtml(markdownParser.parse(value)),
                                isHref: Boolean(value.match(isHref)),
                                isDate: Boolean(value.match(isDateValue) && key.match(isDateKey))
                            };
                            if (item[key].isDate) {
                                const match = isDateValue.exec(value);
                                item[key].date = new Date(match[3], match[2] - 1, match[1]);
                            }
                        }
                        return item;
                    }, {
                        id: `item${id}`,
                        extId: entry.title.$t      // start with setting the item.id
                    });
            });

            return {
                feed,
                entries
            };
        }
    }
})();
