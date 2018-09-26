import getContents from '../../../../src/shared/services/google-sheet/google.sheet';
import { BELEID_PAGES } from '../../../../src/shared/cms-name-mapping';
import PAGES from '../../../../src/pages';

(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpUserContentWidget', {
            bindings: {
                type: '@',
                limitTo: '<'
            },
            templateUrl: 'modules/page/components/user-content-widget/user-content-widget.html',
            controller: DpUserContentWidgetController,
            controllerAs: 'vm'
        });

    DpUserContentWidgetController.$inject = ['$scope'];

    function DpUserContentWidgetController ($scope) {
        const vm = this;

        vm.feed = null;
        vm.entries = [];

        vm.getPageNameForCMS = (type, id) => {
            if (type === 'beleid') {
                return BELEID_PAGES[id];
            } else if (type === 'news') {
                return PAGES.NIEUWS;
            }
        };

        getContents(vm.type)
            .then(contents => {
                vm.feed = contents.feed;
                vm.entries = contents.entries;
                $scope.$digest();
            });
    }
})();
