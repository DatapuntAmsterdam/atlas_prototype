describe('The dp-search-results-header component', () => {
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

    beforeEach(() => {
        angular.mock.module(
            'dpSearchResults',
            $provide => {
                $provide.value('store', angular.noop);
                $provide.value('searchTitle', searchTitle);
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        spyOn(searchTitle, 'getTitleData').and.callThrough();
    });

    function getComponent (numberOfResults, query, location, category, searchResults) {
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

        if (searchResults) {
            element.setAttribute('search-results', 'searchResults');
        }

        scope = $rootScope.$new();
        scope.numberOfResults = numberOfResults;
        scope.searchResults = searchResults;
        scope.location = location;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('calls the getTitleData function of the searchTitle service with the same parameters', () => {
        getComponent(45, 'westerpark', [52.123, 4.789], 'Adressen', [{slug: 'category'}]);

        expect(searchTitle.getTitleData).toHaveBeenCalledWith(
            45, 'westerpark', [52.123, 4.789], 'Adressen', [{slug: 'category'}]);
    });

    it('shows the title and sub title', () => {
        var component = getComponent();
        expect(component.find('h1').text()).toBe('title');
        expect(component.find('h2').text()).toBe('subTitle');
    });

    it('does not show the subtitle if only the title is set', () => {
        searchTitle.getTitleData.and.returnValue({ title: 'title' });

        var component = getComponent();

        expect(component.find('h1').text()).toBe('title');
        expect(component.find('h2').length).toBe(0);
    });
});
