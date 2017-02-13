(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpNewsWidget', {
            templateUrl: 'modules/page/components/news-widget/news-widget.html',
            controller: DpNewsWidgetController,
            controllerAs: 'vm'
        });

    DpNewsWidgetController.$inject = ['$sce', '$scope', 'markdownParser'];

    function DpNewsWidgetController ($sce, $scope, markdownParser) {
        let vm = this;

        vm.feed = null;
        vm.newsEntries = [];

        vm.setNews = function (news) {
            // Set feed properties
            vm.feed = {
                title: news.feed.title.$t,
                lastUpdated: news.feed.updated.$t
            };

            // Extract entries
            vm.newsEntries = news.feed.entry.map(entry => {
                // Extract the contents
                let result = entry.content.$t   // attrx: value, attry: value, ....
                    .replace(/^attr/, '')       // x: value, attry: value, ...
                    .split(/, attr/)            // [x:value, y:value, ...]
                    .map(keyValue => keyValue.split(/: ([^]*)/))    // [[x, value], [y, value], ...
                    .reduce((item, [key, value]) => {
                        item[key] = value;      // item.x = value, item.y = value, ...
                        return item;
                    }, {
                        id: entry.title.$t      // start with setting the item.id
                    });

                result.contents = $sce.trustAsHtml(markdownParser.parse(result.contents));

                return result;
            });
        };
    }
})();
