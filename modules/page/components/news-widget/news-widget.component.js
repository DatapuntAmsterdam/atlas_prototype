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
                let result = {
                    id: entry.title.$t
                };

                // Extract the contents
                let content = entry.content.$t;
                content.split(/(^|, )attr/).forEach(keyValue => {
                    if (keyValue) {
                        let i = keyValue.indexOf(':');
                        let key = keyValue.substring(0, i);
                        let value = keyValue.substring(i + 1);
                        result[key] = value;
                    }
                });

                result.contents = $sce.trustAsHtml(markdownParser.parse(result.contents));

                return result;
            });
        };
    }
})();
