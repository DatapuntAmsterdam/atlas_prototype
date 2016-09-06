describe('The dp-data-selection-table component', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            function ($provide) {
                $provide.factory('dpDataSelectionPaginationDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent (content) {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-selection-table');
        element.setAttribute('content', 'content');
        element.setAttribute('current-page', 'currentPage');

        scope = $rootScope.$new();
        scope.content = content;
        scope.currentPage = 1;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('renders am HTML table', function () {
        var component,
            content;

        content = {
            head: ['Field A', 'Field B'],
            body: [
                ['Cell A1', 'Cell B1'],
                ['Cell A2', 'Cell B2'],
                ['Cell A3', 'Cell B3']
            ]
        };

        component = getComponent(content);

        expect(component.find('table').length).toBe(1);

        expect(component.find('thead tr').length).toBe(1);
        expect(component.find('thead tr th').eq(0).text()).toContain('Field A');
        expect(component.find('thead tr th').eq(1).text()).toContain('Field B');

        expect(component.find('tbody tr').length).toBe(3);
        expect(component.find('tbody tr:nth-child(1) td:nth-child(1)').text()).toContain('Cell A1');
        expect(component.find('tbody tr:nth-child(1) td:nth-child(2)').text()).toContain('Cell B1');

        expect(component.find('tbody tr:nth-child(2) td:nth-child(1)').text()).toContain('Cell A2');
        expect(component.find('tbody tr:nth-child(2) td:nth-child(2)').text()).toContain('Cell B2');

        expect(component.find('tbody tr:nth-child(3) td:nth-child(1)').text()).toContain('Cell A3');
        expect(component.find('tbody tr:nth-child(3) td:nth-child(2)').text()).toContain('Cell B3');
    });
});