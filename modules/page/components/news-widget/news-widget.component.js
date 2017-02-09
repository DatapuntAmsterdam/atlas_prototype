(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpNewsWidget', {
            templateUrl: 'modules/page/components/news-widget/news-widget.html',
            controller: DpNewsWidgetController,
            controllerAs: 'vm'
        });

    DpNewsWidgetController.$inject = ['$window', '$scope'];

    function DpNewsWidgetController ($window, $scope) {
        let vm = this;

        vm.feed = null;
        vm.newsEntries = [];

        vm.setNews = function (news) {
            vm.feed = {
                title: news.feed.title.$t,
                lastUpdated: news.feed.updated.$t
            };

            vm.newsEntries = news.feed.entry.map(entry => {
                let content = entry.content.$t;
                let result = {
                    id: entry.title.$t
                };
                ['datum', 'titel', 'short', 'contents'].forEach((key, i, keys) => {
                    let re = '^.*attr' + key + ': (.*)';
                    if (i !== keys.length - 1) {
                        re += ', attr' + keys[i + 1] + '.*';
                    }
                    re += '$';
                    result[key] = content.replace(new RegExp(re), '$1');
                });
                return result;
            });
        };

        $window.setNews = (news) => $scope.$applyAsync(() => vm.setNews(news));
    }
})();
