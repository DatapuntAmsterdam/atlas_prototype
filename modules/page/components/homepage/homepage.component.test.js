import ReactDOM from 'react-dom';
import { fetchStraatbeeldById } from '../../../../src/map/ducks/straatbeeld/straatbeeld';
import { MAP_MODE, switchMode, switchPage } from '../../../../src/shared/ducks/ui/ui';
import PAGES from '../../../../src/pages';

describe('The dp-homepage component', () => {
    const HOMEPAGE_CONFIG = {
        PANORAMA: {
            id: 'abc789',
            heading: 45
        }
    };

    let $compile,
        $rootScope,
        store,
        $window,
        $timeout,
        originalWindow;

    beforeEach(() => {
        angular.mock.module(
            'dpPage',
            {
                store: {
                    dispatch: angular.noop
                }
            },
            function ($provide) {
                $provide.constant('HOMEPAGE_CONFIG', HOMEPAGE_CONFIG);
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _$window_, _$timeout_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            $window = _$window_;
            $timeout = _$timeout_;
        });

        originalWindow = $window;

        spyOn(store, 'dispatch');
    });

    afterEach(() => {
        $window = originalWindow;
    });

    function getComponent () {
        const element = document.createElement('dp-homepage');
        const scope = $rootScope.$new();

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('clicking on straatbeeld will dispatch FETCH_STRAATBEELD_BY_ID', () => {
        const component = getComponent();

        component.find('.qa-straatbeeld-link button').click();

        expect(store.dispatch).toHaveBeenCalledWith(fetchStraatbeeldById(HOMEPAGE_CONFIG.PANORAMA));
        expect(store.dispatch).toHaveBeenCalledWith(switchMode(MAP_MODE.PANORAMA));
        expect(store.dispatch).toHaveBeenCalledWith(switchPage(PAGES.KAART_PANORAMA));
    });

    describe('setting search component', () => {
        // if we don't use this fakeCandidate, the test will fail:
        // TypeError: undefined is not a constructor (evaluating 'candidate.getAttribute(name)') thrown
        const fakeCandidate = {
            getAttribute: angular.noop
        };
        beforeEach(() => {
            // mock all the React element creation methods
            $window.render = angular.noop;
            $window.HomepageAddressBlockWrapper = 'fakeWrapper';
            $window.React = {
                createElement: () => 'fakeReactElement'
            };
            ReactDOM.unmountComponentAtNode = () => angular.noop();
        });

        it('does the react createElement call', () => {
            // if we don't use this fakeCandidate, the test will fail:
            // TypeError: undefined is not a constructor (evaluating 'candidate.getAttribute(name)') thrown
            spyOn($window.document, 'querySelector').and.returnValue(fakeCandidate);
            spyOn($window, 'render').and.callThrough();
            getComponent();

            $timeout.flush();
            expect($window.render).toHaveBeenCalledWith('fakeReactElement', fakeCandidate);
        });

        it('does not do the react createElement call', () => {
            spyOn($window.document, 'querySelector').and.returnValue(undefined);
            spyOn($window, 'render').and.callThrough();

            getComponent();

            $timeout.flush();
            expect($window.render).not.toHaveBeenCalledWith('fakeReactElement', fakeCandidate);
        });
    });
});
