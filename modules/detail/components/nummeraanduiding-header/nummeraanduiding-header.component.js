(function () {
    'use strict';

    angular
        .module('dpDetail')
        .component('dpNummeraanduidingHeader', {
            bindings: {
                heading: '@',
                metaData: '=',
                hoofdadres: '=',
                verblijfsobjectEndpoint: '@'
            },
            templateUrl: 'modules/detail/components/nummeraanduiding-header/nummeraanduiding-header.html',
            controller: DpNummeraanduidingHeaderController,
            controllerAs: 'vm'
        });

    DpNummeraanduidingHeaderController.$inject = ['api'];

    function DpNummeraanduidingHeaderController (api) {
        var vm = this;

        api.getByUrl(vm.verblijfsobjectEndpoint).then(function (vboData) {
            vm.isGevormd = Number(vboData.status.code) === 18;

            if (vm.isGevormd) {
                vm.headingHtml = '<em>' + vm.heading + '</em>';
                vm.statusOmschrijving = vboData.status.omschrijving;
            }
        });
    }
})();
