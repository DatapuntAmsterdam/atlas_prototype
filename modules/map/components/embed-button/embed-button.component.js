((() => {
    'use strict';

    angular
        .module('dpMap')
        .component('dpEmbedButton', {
            transclude: true,
            templateUrl: 'modules/map/components/embed-button/embed-button.html',
            controller: DpEmbedButtonController,
            controllerAs: 'vm'
        });

    DpEmbedButtonController.$inject = ['store', 'embed'];

    function DpEmbedButtonController (store, embed) {
        const vm = this;

        store.subscribe(update);
        update();

        function update () {
            const ghostState = angular.copy(store.getState());
            ghostState.atlas.isEmbedPreview = false;
            ghostState.atlas.isEmbed = false;

            vm.link = embed.getLink(ghostState);
        }
    }
}))();
