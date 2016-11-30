describe('The dp-data-selection-list component', function () {
    let $compile,
        $rootScope,
        store,
        ACTIONS,
        mockedContent;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                store: {
                    dispatch: angular.noop
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedContent = {
            head: ['Column A', 'Column B', 'Column C'],
            body: [
                {
                    detailEndpoint: 'https://www.example.com/path/to/1/',
                    content: [
                        [
                            {
                                key: 'var_a1',
                                value: 'VALUE_1_A1'
                            },
                            {
                                key: 'var_a2',
                                value: 'VALUE_1_A2'
                            }
                        ], [
                            {
                                key: 'var_b1',
                                value: 'VALUE_1_B1'
                            }, {
                                key: 'var_b2',
                                value: 'VALUE_1_B2'
                            }
                        ], [
                            {
                                key: 'var_c',
                                value: 'VALUE_1_C'
                            }
                        ]
                    ]
                }, {
                    detailEndpoint: 'https://www.example.com/path/to/2/',
                    content: [
                        [
                            {
                                key: 'var_a1',
                                value: 'VALUE_2_A1'
                            },
                            {
                                key: 'var_a2',
                                value: 'VALUE_2_A2'
                            }
                        ], [
                            {
                                key: 'var_b1',
                                value: 'VALUE_2_B1'
                            }, {
                                key: 'var_b2',
                                value: 'VALUE_2_B2'
                            }
                        ], [
                            {
                                key: 'var_c',
                                value: 'VALUE_2_C'
                            }
                        ]
                    ]
                }
            ],
            formatters: [null, null, null]
        };

        spyOn(store, 'dispatch');
    });

    function getComponent () {
        let component,
            element,
            scope;

        element = document.createElement('dp-data-selection-list');
        element.setAttribute('content', 'content');

        scope = $rootScope.$new();
        scope.content = mockedContent;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('returns a <ul> with a <li> for each item', function () {
        const component = getComponent();

        expect(component.find('ul').length).toBe(1);
        expect(component.find('ul li').length).toBe(2);
    });

    it('groups the first group of variables inside a dp-link to FETCH_DETAIL', function () {
        const component = getComponent();

        // The first item
        expect(component.find('li:nth-child(1) dp-link').length).toBe(1);
        expect(component.find('li:nth-child(1) dp-link').text()).toContain('VALUE_1_A1 VALUE_1_A2');

        expect(store.dispatch).not.toHaveBeenCalled();
        component.find('li:nth-child(1) dp-link button').click();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'https://www.example.com/path/to/1/'
        });

        // The second item
        expect(component.find('li:nth-child(2) dp-link').length).toBe(1);
        expect(component.find('li:nth-child(2) dp-link').text()).toContain('VALUE_2_A1 VALUE_2_A2');

        component.find('li:nth-child(2) dp-link button').click();
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'https://www.example.com/path/to/2/'
        });
    });

    it('lists the other formatted groups of variables behind the dp-link', function () {
        const component = getComponent();

        // First row, second group of variables
        expect(component.find('li:nth-child(1) > dp-data-selection-formatter').eq(0).text().trim())
            .toBe('VALUE_1_B1 VALUE_1_B2');

        // First row, last (single) variable
        expect(component.find('li:nth-child(1) > dp-data-selection-formatter').eq(1).text().trim())
            .toBe('VALUE_1_C');

        // Second row, second group of variables
        expect(component.find('li:nth-child(2) > dp-data-selection-formatter').eq(0).text().trim())
            .toBe('VALUE_2_B1 VALUE_2_B2');

        // Second row, last (single) variable
        expect(component.find('li:nth-child(2) > dp-data-selection-formatter').eq(1).text().trim())
            .toBe('VALUE_2_C');
    });

    it('uses the use-inline option of dp-data-selection-formatter', function () {
        const component = getComponent();

        expect(component.find('dp-data-selection-formatter').length).toBe(6);
        expect(component.find('dp-data-selection-formatter').eq(0).attr('use-inline')).toBe('true');
        expect(component.find('dp-data-selection-formatter').eq(1).attr('use-inline')).toBe('true');
        expect(component.find('dp-data-selection-formatter').eq(2).attr('use-inline')).toBe('true');
        expect(component.find('dp-data-selection-formatter').eq(3).attr('use-inline')).toBe('true');
        expect(component.find('dp-data-selection-formatter').eq(4).attr('use-inline')).toBe('true');
        expect(component.find('dp-data-selection-formatter').eq(5).attr('use-inline')).toBe('true');
    });
});
