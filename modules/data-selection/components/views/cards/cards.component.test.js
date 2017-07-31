describe('The cards component', () => {
    'use strict';

    let $rootScope,
        $compile,
        store,
        ACTIONS;

    const mockedStore = {
        dispatch: angular.noop
    };

    const mockedACTIONS = {
        FETCH_DETAIL: 'Fetch Detail'
    };

    const mockedContent = {
        body: [
            {
                content: [
                    [
                        {
                            key: 'key',
                            value: 'value'
                        }
                    ], [
                        {
                            key: 'key',
                            value: 'value'
                        }
                    ], [
                        {
                            key: 'key',
                            value: 'value'
                        }
                    ], [
                        {
                            key: 'key',
                            value: 'value'
                        }
                    ], [
                        {
                            key: 'key',
                            value: 'value'
                        }]
                ],
                detailEndpoint: 'endpoint'
            }
        ],
        formatters: [],
        head: [],
        templates: []
    };

    beforeEach(() => {
        angular.mock.module('dpDataSelection', {
            store: mockedStore,
            ACTIONS: mockedACTIONS
        });

        angular.mock.inject((_$rootScope_, _$compile_, _store_, _ACTIONS_) => {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent () {
        const element = document.createElement('dp-data-selection-cards');
        element.setAttribute('content', 'content');

        const scope = $rootScope.$new();
        scope.content = mockedContent;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('can load a detail page for a card', () => {
        const component = getComponent();

        component.find('.qa-card-fetch-detail')[0].click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: mockedContent.body[0].detailEndpoint
        });
    });
});
