(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .component('dpStraatbeeldMetadata', {
            bindings: {
                date: '=',
                location: '='
            },
            templateUrl: 'modules/straatbeeld/components/metadata/metadata.html',
            controllerAs: 'vm',
            controller: function () {
                var vm = this;

                vm.showMetaInfo = function () {
                    return angular.isDate(vm.date) && angular.isArray(vm.location);
                };
            }
        });
})();
