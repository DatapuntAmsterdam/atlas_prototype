describe('The cards component', function () {
    'use strict';

    let $rootScope,
        $compile,
        store,
        ACTIONS;

    let mockedStore = {
        dispatch: angular.noop
    };

    let mockedACTIONS = {
        FETCH_DETAIL: 'Fetch Detail'
    };

    let mockedContent = {
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

    beforeEach(function () {
        angular.mock.module('dpDataSelection', {
            store: mockedStore,
            ACTIONS: mockedACTIONS
        });

        angular.mock.inject(function (_$rootScope_, _$compile_, _store_, _ACTIONS_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent () {
        let component,
            element,
            scope;

        element = document.createElement('dp-data-selection-cards');
        element.setAttribute('content', 'content');

        scope = $rootScope.$new();
        scope.content = mockedContent;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('can load a detail page for a card', function () {
        let component = getComponent();

        component.find('.qa-cards-fetch-detail')[0].click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: mockedContent.body[0].detailEndpoint
        });
    });
});
