describe('The dp-search-results-header component', function () {
    var $compile,
        $rootScope,
        searchTitle = {
            getTitleData: function () {
                return {
                    title: 'title',
                    subTitle: 'subTitle'
                };
            }
        };

    beforeEach(function () {
        angular.mock.module(
            'dpSearchResults',
            function ($provide) {
                $provide.value('store', angular.noop);
                $provide.value('searchTitle', searchTitle);
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        spyOn(searchTitle, 'getTitleData').and.callThrough();
    });

    function getComponent (numberOfResults, query, location, category) {
        var component,
            element,
            scope;

        element = document.createElement('dp-search-results-header');
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

    it('calls the getTitleData function of the searchTitle service with the same parameters', function () {
        getComponent(45, 'westerpark', [52.123, 4.789], 'Adressen');

        expect(searchTitle.getTitleData).toHaveBeenCalledWith(45, 'westerpark', [52.123, 4.789], 'Adressen');
    });

    it('shows the title and sub title', function () {
        var component = getComponent(45, 'westerpark', [52.123, 4.789], 'Adressen');

        expect(component.find('h1').text()).toBe('title');
        expect(component.find('h2').text()).toBe('subTitle');
    });
});
