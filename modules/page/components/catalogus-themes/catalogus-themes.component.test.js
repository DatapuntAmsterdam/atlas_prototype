import { toDatasetsWithFilter } from '../../../../src/store/redux-first-router';

describe('The dp-catalogus-themes', () => {
    let $compile,
        $rootScope,
        store;

    beforeEach(() => {
        angular.mock.module(
            'dpPage',
            {
                store: {
                    dispatch: angular.noop
                }
            },
            ($provide) => {
                $provide.constant('CATALOGUS_THEMES_CONFIG', [
                    {
                        name: 'Thema A',
                        slug: 'thema-a',
                        icon: 'icon-a'
                    }, {
                        name: 'Thema B',
                        slug: 'thema-b',
                        icon: 'icon-b'
                    }, {
                        name: 'Thema C',
                        slug: 'thema-c',
                        icon: 'icon-c'
                    }, {
                        name: 'Thema D',
                        slug: 'thema-d',
                        icon: 'icon-d'
                    }, {
                        name: 'Thema E',
                        slug: 'thema-e',
                        icon: 'icon-e'
                    }
                ]);
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent () {
        const element = document.createElement('dp-catalogus-themes');
        const scope = $rootScope.$new();

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    // Todo: DP-6235
    it('list all themes as links to data selection', () => {
        const component = getComponent();

        // The first link
        expect(component.find('.qa-theme-link').eq(0).text()).toBe('Thema A');
        expect(component.find('.qa-theme-link').eq(0).attr('link-class'))
            .toContain('c-catalogus-theme__icon c-catalogus-theme__icon--icon-a');

        const scope = component.isolateScope();
        const link = component.find('.qa-theme-link').eq(4);
        expect(link).toHaveAttr('to', 'theme.linkTo');
        expect(scope.vm.themes[4].linkTo).toEqual(toDatasetsWithFilter('thema-e'));

        store.dispatch.calls.reset();

        // The last link
        expect(component.find('.qa-theme-link').eq(4).text()).toBe('Thema E');
        expect(component.find('.qa-theme-link').eq(4).attr('link-class'))
            .toContain('c-catalogus-theme__icon c-catalogus-theme__icon--icon-e');
    });
});
