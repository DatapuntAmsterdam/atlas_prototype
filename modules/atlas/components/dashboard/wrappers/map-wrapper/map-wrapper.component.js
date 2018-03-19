angular
    .module('atlas')
    .component('dpMapWrapper', {
        bindings: {
            data: '<'
        },
        templateUrl: 'modules/atlas/components/dashboard/wrappers/map-wrapper/map-wrapper.html', //eslint-disable-line
        controller: DpMapWrapper,
        controllerAs: 'vm'
    });

DpMapWrapper.$inject = ['$timeout', '$window'];

function DpMapWrapper ($timeout, $window) {
    const vm = this;

    const React = $window.React;
    const render = $window.render;
    const MapWrapper = $window.MapWrapper;

    const mountReactComponents = (resize) => {
        const graphNode = document.getElementById('map-wrapper');
        /* istanbul ignore next */
        if (graphNode) {
            render(React.createElement(MapWrapper, { data: resize }), graphNode);
        }
    };

    $timeout(() => {
        mountReactComponents(vm.resize);
    });
}
