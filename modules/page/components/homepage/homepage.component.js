import ReactDOM from 'react-dom';
import { fetchStraatbeeldById } from '../../../../src/map/ducks/straatbeeld/straatbeeld';
import { showMap, switchPage } from '../../../../src/shared/ducks/ui/ui';
import PAGES from '../../../../src/pages';
import ACTIONS from '../../../../src/shared/actions';

(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpHomepage', {
            templateUrl: 'modules/page/components/homepage/homepage.html',
            controller: DpHomepageController,
            controllerAs: 'vm'
        });

    DpHomepageController.$inject = ['store', 'HOMEPAGE_CONFIG', '$window', '$timeout'];

    function DpHomepageController (store, HOMEPAGE_CONFIG, $window, $timeout) {
        const vm = this;
        const React = $window.React;
        const render = $window.render;
        const homepageAddressBlockWrapper = $window.HomepageAddressBlockWrapper;
        let homepageAddressBlockWrapperContainer;

        vm.openMap = () => {
            store.dispatch(showMap());
            store.dispatch(switchPage(PAGES.KAART));
        };

        vm.openPanorama = () => {
            store.dispatch(fetchStraatbeeldById(HOMEPAGE_CONFIG.PANORAMA));
            store.dispatch(switchPage(PAGES.KAART_PANORAMA));
        };

        vm.fetchDataSelection = () => {
            store.dispatch({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: 'dcatd',
                    filters: {},
                    view: 'CATALOG',
                    page: 1
                }
            });
            store.dispatch(switchPage(PAGES.DATASETS));
        };

        $timeout(setReactComponents);

        function setReactComponents () {
            homepageAddressBlockWrapperContainer = $window.document.querySelector('#homepage-address-block');
            if (homepageAddressBlockWrapper && homepageAddressBlockWrapperContainer) {
                render(React.createElement(homepageAddressBlockWrapper, null), homepageAddressBlockWrapperContainer);
            }
        }

        this.$onDestroy = () => {
            if (homepageAddressBlockWrapperContainer) {
                ReactDOM.unmountComponentAtNode(homepageAddressBlockWrapperContainer);
            }
        };
    }
})();
