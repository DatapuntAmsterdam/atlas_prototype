describe('The dp-data-selection-pagination component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS;

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

        spyOn(store, 'dispatch');
    });

    function getComponent (currentPage, numberOfPages) {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-selection-pagination');
        element.setAttribute('current-page', 'currentPage');
        element.setAttribute('number-of-pages', 'numberOfPages');

        scope = $rootScope.$new();
        scope.currentPage = currentPage;
        scope.numberOfPages = numberOfPages;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('doesn\'t do anything if there is only one page', function () {
        var component = getComponent(1, 1);

        expect(component.find('dp-data-selection-pagination-link').length).toBe(0);
        expect(component.find('form').length).toBe(0);
    });

    it('when there is pagination; four child directives handle the presentation of the buttons', function () {
        var component = getComponent(1, 10);

        expect(component.find('dp-data-selection-pagination-link').length).toBe(4);
        expect(component.find('dp-data-selection-pagination-link').eq(0).attr('link')).toBe('vm.firstPage');
        expect(component.find('dp-data-selection-pagination-link').eq(1).attr('link')).toBe('vm.previousPage');
        expect(component.find('dp-data-selection-pagination-link').eq(2).attr('link')).toBe('vm.nextPage');
        expect(component.find('dp-data-selection-pagination-link').eq(3).attr('link')).toBe('vm.lastPage');

        expect(component.find('form').length).toBe(1);
    });

    it('has first page and previous buttons that are only enabled when not on the first page', function () {
        var component,
            scope;

        //When on the first page
        component = getComponent(1, 14);
        scope = component.isolateScope();

        expect(scope.vm.firstPage).toEqual({
            label: 'Eerste',
            class_name: 'c-data-selection-pagination-link--first',
            page: 1,
            enabled: false
        });

        expect(scope.vm.previousPage).toEqual({
            label: 'Vorige',
            class_name: 'c-data-selection-pagination-link--previous',
            page: null,
            enabled: false
        });

        //When not on the first page
        component = getComponent(13, 14);
        scope = component.isolateScope();

        expect(scope.vm.firstPage).toEqual({
            label: 'Eerste',
            class_name: 'c-data-selection-pagination-link--first',
            page: 1,
            enabled: true
        });

        expect(scope.vm.previousPage).toEqual({
            label: 'Vorige',
            class_name: 'c-data-selection-pagination-link--previous',
            page: 12,
            enabled: true
        });
    });

    it('has next page and last page buttons that are only enabled when not on the last page', function () {
        var component,
            scope;

        //When on the last page
        component = getComponent(14, 14);
        scope = component.isolateScope();

        expect(scope.vm.nextPage).toEqual({
            label: 'Volgende',
            class_name: 'c-data-selection-pagination-link--next',
            page: null,
            enabled: false
        });

        expect(scope.vm.lastPage).toEqual({
            label: 'Laatste',
            class_name: 'c-data-selection-pagination-link--last',
            page: 14,
            enabled: false
        });

        //When not on the first page
        component = getComponent(13, 14);
        scope = component.isolateScope();

        expect(scope.vm.nextPage).toEqual({
            label: 'Volgende',
            class_name: 'c-data-selection-pagination-link--next',
            page: 14,
            enabled: true
        });

        expect(scope.vm.lastPage).toEqual({
            label: 'Laatste',
            class_name: 'c-data-selection-pagination-link--last',
            page: 14,
            enabled: true
        });
    });

    it('has a form that navigates directly to a specific page', function () {
        var component = getComponent(1, 2);

        //Enter a value
        component.find('input')[0].value = '2';
        component.find('input').trigger('change');

        //Submit the form
        component.find('form').trigger('submit');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.NAVIGATE_DATA_SELECTION,
            payload: 2
        });
    });

    it('won\'t try to navigate to unexisting pages', function () {
        var component = getComponent(1, 2);

        //Zero
        component.find('input')[0].value = '0';
        component.find('input').trigger('change');
        component.find('form').trigger('submit');

        expect(store.dispatch).not.toHaveBeenCalled();


        //Negative numbers
        component.find('input')[0].value = '-1';
        component.find('input').trigger('change');
        component.find('form').trigger('submit');

        expect(store.dispatch).not.toHaveBeenCalled();


        //Number larger than the total number of pages
        component.find('input')[0].value = '3';
        component.find('input').trigger('change');
        component.find('form').trigger('submit');

        expect(store.dispatch).not.toHaveBeenCalled();
    });
});