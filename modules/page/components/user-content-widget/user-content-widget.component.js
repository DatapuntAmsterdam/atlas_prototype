((() => {
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

    DpUserContentWidgetController.$inject = ['googleSheet'];

    function DpUserContentWidgetController (googleSheet) {
        const vm = this;

        vm.feed = null;
        vm.entries = [];

        googleSheet.getContents(vm.type)
            .then(contents => {
                vm.feed = contents.feed;
                vm.entries = contents.entries;
            });
    }
}))();
