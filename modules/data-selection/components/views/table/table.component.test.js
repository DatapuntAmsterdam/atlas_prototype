describe('The dp-data-selection-table component', function () {
    let $compile,
        $rootScope,
        mockedContent,
        store,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                makeBoldFormatterFilter: function (input) {
                    return '<strong>' + input + '</strong>';
                },
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
                        [{
                            key: 'var_a',
                            value: '1A'
                        }], [{
                            key: 'var_b',
                            value: '1B'
                        }], [{
                            key: 'var_c',
                            value: '1C'
                        }]
                    ]
                }, {
                    detailEndpoint: 'https://www.example.com/path/to/2/',
                    content: [
                        [{
                            key: 'var_a',
                            value: '2A'
                        }], [{
                            key: 'var_b',
                            value: '2B'
                        }], [{
                            key: 'var_c',
                            value: '2C'
                        }]
                    ]
                }
            ],
            formatters: [null, null, 'makeBoldFormatter']
        };

        spyOn(store, 'dispatch');
    });

    function getComponent () {
        let component,
            element,
            scope;

        element = document.createElement('dp-data-selection-table');
        element.setAttribute('content', 'content');

        scope = $rootScope.$new();
        scope.content = mockedContent;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('renders a <thead> with all the column names', function () {
        const component = getComponent();

        expect(component.find('table thead').length).toBe(1);
        expect(component.find('table thead tr').length).toBe(1);
        expect(component.find('table thead tr th').length).toBe(3);
        expect(component.find('table thead th').eq(0).text().trim()).toBe('Column A');
        expect(component.find('table thead th').eq(1).text().trim()).toBe('Column B');
        expect(component.find('table thead th').eq(2).text().trim()).toBe('Column C');
    });

    it('renders <tr>\'s inside <tbody> for each row', function () {
        const component = getComponent();

        expect(component.find('table tbody').length).toBe(1);
        expect(component.find('table tbody tr').length).toBe(2);
    });

    it('applies dp-data-selection-formatter to each <td> inside <tbody>', function () {
        const component = getComponent();

        // The first two columns have no formatters
        expect(component.find('tbody tr:nth-child(1) td:nth-child(1)').text().trim()).toBe('1A');
        expect(component.find('tbody tr:nth-child(1) td:nth-child(2)').text().trim()).toBe('1B');
        expect(component.find('tbody tr:nth-child(2) td:nth-child(1)').text().trim()).toBe('2A');
        expect(component.find('tbody tr:nth-child(2) td:nth-child(2)').text().trim()).toBe('2B');

        // The third column does use a formatter
        expect(component.find('tbody tr:nth-child(1) td:nth-child(3)').html().trim()).toContain('<strong>1C</strong>');
        expect(component.find('tbody tr:nth-child(2) td:nth-child(3)').html().trim()).toContain('<strong>2C</strong>');
    });

    it('makes each <tr> clickable (will FETCH_DETAIL)', function () {
        const component = getComponent();

        expect(store.dispatch).not.toHaveBeenCalled();

        // The first row
        component.find('tbody tr:nth-child(1)').click();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'https://www.example.com/path/to/1/'
        });

        // The second row
        component.find('tbody tr:nth-child(2)').click();
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'https://www.example.com/path/to/2/'
        });
    });
});
