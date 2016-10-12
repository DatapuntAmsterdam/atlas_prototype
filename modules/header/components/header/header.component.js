/**
 * @ngdoc directive
 * @name atlasHeader.component:atlasHeader
 * @restrict 'E'
 * @scope
 * @example
 * <pre>
 *  <atlas-header query="{{ header.query }}" is-print-mode="vm.isPrintMode">
 *  </atlas-header>
 * </pre>
 * @description
 * The main component of the atlasHeader module. Component takes two elements
 * query and isPRintMode.
 */

(function () {
    'use strict';

    angular
        .module('atlasHeader')
        .component('atlasHeader', {
            bindings: {
                query: '@',
                isPrintMode: '='
            },
            templateUrl: 'modules/header/components/header/header.html',
            controller: AtlasHeaderController,
            controllerAs: 'vm'
        });

    AtlasHeaderController.$inject = ['user'];

    /**
     * @ngdoc controller
     * @name atlasHeader.controller:AtlasHeaderController
     * @link atlasHeader.controller:AtlasHeaderController AtlasHeaderController
     * @requires user
     * @description
     * Controller definition of the atlasHeader componnent. It reacts to changes in the 
     * the user service.
     */
    function AtlasHeaderController(user) {
        var vm = this;

        vm.isLoggedIn = function () {
            return user.getStatus().isLoggedIn;
        };

        vm.logout = user.logout;
    }
})();