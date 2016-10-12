describe('The atlas-search-results-header component', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module(
            'atlasSearchResults',
            function ($provide) {
                $provide.value('coordinatesFilter', function (input) {
                    return 'X, Y (' + input.join(', ') + ')';
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent (numberOfResults, query, location, category) {
        var component,
            element,
            scope;

        element = document.createElement('atlas-search-results-header');
        element.setAttribute('number-of-results', 'numberOfResults');

        if (angular.isString(query)) {
            element.setAttribute('query', query);
        }

        if (angular.isArray(location)) {
            element.setAttribute('location', 'location');
        }

        if (angular.isString(category)) {
            element.setAttribute('category', category);
        }

        scope = $rootScope.$new();
        scope.numberOfResults = numberOfResults;
        scope.location = location;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('can show the number of search results when searching with a query', function () {
        var component = getComponent(45, 'westerpark', null, null);

        expect(component.find('.o-header__title').text()).toContain('45 resultaten');
        expect(component.find('.o-header__subtitle').text()).toContain('"westerpark"');
    });

    it('can show the number of search results when searching by location', function () {
        var component = getComponent(46, null, [52.123, 4.789], null);

        expect(component.find('.o-header__title').text()).toContain('46 resultaten');
        expect(component.find('.o-header__subtitle').text()).toContain('X, Y (52.123, 4.789)');
    });

    it('can show the number of search results for a specific category (query search only)', function () {
        var component = getComponent(47, 'westerpark', null, 'Adressen');

        // The category name will be converted to lowercase
        expect(component.find('.o-header__title').text()).toContain('47 adressen');
        expect(component.find('.o-header__subtitle').text()).toContain('"westerpark"');
    });

    it('shows a message when no results have been found', function () {
        var component;

        // When searching by query
        component = getComponent(0, 'westerpark', null, null);
        expect(component.find('.o-header__title').text()).toContain('Geen resultaten gevonden');
        expect(component.find('.o-header__subtitle').text()).toContain('"westerpark"');

        // When searching by location
        component = getComponent(0, null, [52.123, 4.789], null);
        expect(component.find('.o-header__title').text()).toContain('Geen resultaten gevonden');
        expect(component.find('.o-header__subtitle').text()).toContain('X, Y (52.123, 4.789)');
    });

    it('differentiates between one or more search results (resultaat vs. resultaten)', function () {
        var component;

        // When searching by query (1 result)
        component = getComponent(1, 'oosterpark', null, null);
        expect(component.find('.o-header__title').text()).toContain('1 resultaat');

        // When searching by query (> 1 results)
        component = getComponent(2, 'oosterpark', null, null);
        expect(component.find('.o-header__title').text()).toContain('2 resultaten');

        // When searching by location (1 result)
        component = getComponent(1, null, [52.321, 4.987], null);
        expect(component.find('.o-header__title').text()).toContain('1 resultaat');

        // When searching by location (> 1 results)
        component = getComponent(2, null, [52.321, 4.987], null);
        expect(component.find('.o-header__title').text()).toContain('2 resultaten');
    });

    it('uses a thousands separator for the number of search results', function () {
        var component;

        // When searching by query
        component = getComponent(1000, 'zuiderpark', null, null);
        expect(component.find('.o-header__title').text()).not.toContain('1000');
        expect(component.find('.o-header__title').text()).toContain('1.000');

        // When searching by location
        component = getComponent(1000, null, [52.963, 4.741], null);
        expect(component.find('.o-header__title').text()).not.toContain('1000');
        expect(component.find('.o-header__title').text()).toContain('1.000');

        // When viewing a category of search results
        component = getComponent(1000, 'zuiderpark', null, 'Adressen');
        expect(component.find('.o-header__title').text()).not.toContain('1000');
        expect(component.find('.o-header__title').text()).toContain('1.000');
    });
});
