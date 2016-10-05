describe('The dp-data-selection-table component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS,
        mockedContent;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                store: {
                    dispatch: function () {}
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
            head: [
                'Field A',
                'Field B'
            ],
            format: [
                {
                    align: 'right'
                },
                {
                    filters: ['postcode']
                }
            ],
            body: [
                {
                    detailEndpoint: 'http://www.example.com/detail/123/',
                    fields: [
                        'Cell A1',
                        '1234AB'
                    ]
                },
                {
                    detailEndpoint: 'http://www.example.com/detail/124/',
                    fields: [
                        'Cell A2',
                        'Cell B2'
                    ]
                },
                {
                    detailEndpoint: 'http://www.example.com/detail/126/',
                    fields: [
                        'Cell A3',
                        'Cell B3'
                    ]
                }
            ]
        };

        spyOn(store, 'dispatch');
    });

    function getComponent (content) {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-selection-table');
        element.setAttribute('content', 'content');

        scope = $rootScope.$new();
        scope.content = content;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('renders an HTML table and applies any filters and formats', function () {
        var component;

        component = getComponent(mockedContent);

        expect(component.find('table').length).toBe(1);

        expect(component.find('thead tr').length).toBe(1);

        expect(component.find('thead tr th').length).toBe(2);
        expect(component.find('thead tr th').eq(0).text()).toContain('Field A');
        expect(component.find('thead tr th').eq(1).text()).toContain('Field B');

        expect(component.find('tbody tr').length).toBe(3);

        expect(component.find('tbody tr:nth-child(1) td').length).toBe(2);
        expect(component.find('tbody tr:nth-child(1) td:nth-child(1)').text()).toContain('Cell A1');
        expect(component.find('tbody tr:nth-child(1) td:nth-child(1)').attr('class'))
            .toContain('u-align--right');
        expect(component.find('tbody tr:nth-child(1) td:nth-child(2)').text()).toContain('1234 AB');
        expect(component.find('tbody tr:nth-child(1) td:nth-child(2)').attr('class'))
            .not.toContain('data-selection__align__right');

        expect(component.find('tbody tr:nth-child(2) td').length).toBe(2);
        expect(component.find('tbody tr:nth-child(2) td:nth-child(1)').text()).toContain('Cell A2');
        expect(component.find('tbody tr:nth-child(2) td:nth-child(2)').text()).toContain('Cell B2');

        expect(component.find('tbody tr:nth-child(3) td').length).toBe(2);
        expect(component.find('tbody tr:nth-child(3) td:nth-child(1)').text()).toContain('Cell A3');
        expect(component.find('tbody tr:nth-child(3) td:nth-child(2)').text()).toContain('Cell B3');
    });

    it('has clickable rows', function () {
        var component;

        component = getComponent(mockedContent);

        component.find('tbody tr:nth-child(1)').click();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'http://www.example.com/detail/123/'
        });

        component.find('tbody tr:nth-child(2)').click();
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'http://www.example.com/detail/124/'
        });

        component.find('tbody tr:nth-child(3)').click();
        expect(store.dispatch).toHaveBeenCalledTimes(3);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'http://www.example.com/detail/126/'
        });
    });
});
