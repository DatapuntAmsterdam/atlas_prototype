describe('The dp-catalogus-themes', () => {
    let $compile,
        $rootScope,
        store,
        ACTIONS;

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

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _ACTIONS_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
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

    it('list all themes as links to data selection', () => {
        const component = getComponent();

        // The first link
        expect(component.find('.qa-theme-link').eq(0).text()).toBe('Thema A');
        expect(component.find('.qa-theme-link').eq(0).attr('class'))
            .toContain('c-catalogus-theme__icon c-catalogus-theme__icon--icon-a');

        component.find('.qa-theme-link').eq(0).click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: {
                dataset: 'catalogus',
                filters: {
                    groups: 'thema-a'
                },
                view: 'CARDS',
                page: 1
            }
        });

        store.dispatch.calls.reset();

        // The last link
        expect(component.find('.qa-theme-link').eq(4).text()).toBe('Thema E');
        expect(component.find('.qa-theme-link').eq(4).attr('class'))
            .toContain('c-catalogus-theme__icon c-catalogus-theme__icon--icon-e');

        component.find('.qa-theme-link').eq(4).click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: {
                dataset: 'catalogus',
                filters: {
                    groups: 'thema-e'
                },
                view: 'CARDS',
                page: 1
            }
        });
    });

    it('when the number of themes is uneven the left column will have more themes than the right column', () => {
        const component = getComponent();
        const firstColumn = component.find('.c-catalogus-themes__column').eq(0);
        const secondColumn = component.find('.c-catalogus-themes__column').eq(2);

        expect(firstColumn.attr('class')).toContain('c-catalogus-themes__column--left');
        expect(firstColumn.find('.qa-theme-link').length).toBe(2);

        expect(secondColumn.attr('class')).toContain('c-catalogus-themes__column--right');
        expect(secondColumn.find('.qa-theme-link').length).toBe(1);
    });

    it('has a link to all catalogus items (without any active filters)', () => {
        const component = getComponent();

        component.find('.qa-go-to-catalogus').click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: {
                dataset: 'catalogus',
                filters: {},
                view: 'CARDS',
                page: 1
            }
        });
    });
});
