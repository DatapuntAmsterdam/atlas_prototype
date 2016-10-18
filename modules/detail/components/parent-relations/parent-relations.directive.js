(function () {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpParentRelations', dpParentRelationsDirective);

    function dpParentRelationsDirective () {
        return {
            restrict: 'E',
            scope: {
                content: '='
            },
            templateUrl: 'modules/detail/components/parent-relations/parent-relations.html',
            controller: DpParentRelationsController,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    DpParentRelationsController.$inject = ['PARENT_RELATIONS_CONFIG'];

    function DpParentRelationsController (PARENT_RELATIONS_CONFIG) {
        var vm = this;

        vm.parentRelations = PARENT_RELATIONS_CONFIG
            .map(convertToObject)
            .map(getRelatedContent)
            .filter(removeEmptyContent);

        function convertToObject (parent) {
            return {
                variable: parent
            };
        }

        function getRelatedContent (parent) {
            parent.data = vm.content[parent.variable] || vm.content['_' + parent.variable] || null;

            return parent;
        }

        function removeEmptyContent (parent) {
            return parent.data !== null;
        }
    }
})();
