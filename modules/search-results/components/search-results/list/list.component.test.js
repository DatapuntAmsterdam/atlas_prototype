describe('The dp-search-results-list component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS,
        mockedCategory;

    beforeEach(function () {
        angular.mock.module(
            'dpSearchResults',
            {
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.value('longNameShortenerFilter', function (input) {
                    return input && input.replace('Vereniging van Eigenaren', 'VVE');
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedCategory = {
            slug: 'openbareruimte',
            count: 11,
            results: [
                {
                    label: 'Link #1',
                    endpoint: 'http://www.example.com/bag/or/1/',
                    hoofdadres: false,
                    subtype: 'weg'
                }, {
                    label: 'Link #2',
                    endpoint: 'http://www.example.com/bag/or/2/',
                    hoofdadres: true,
                    vbo_status: {
                        code: '18',
                        omschrijving: 'verblijfsobject gevormd'
                    },
                    subtype: 'weg'
                }, {
                    label: 'Link #3',
                    endpoint: 'http://www.example.com/bag/or/3/',
                    hoofdadres: false,
                    vbo_status: {
                        code: '18',
                        omschrijving: 'verblijfsobject gevormd'
                    },
                    subtype: 'weg'
                }, {
                    label: '',
                    endpoint: 'http://www.example.com/bag/or/4/',
                    subtype: 'water'
                }, {
                    label: 'Link #5',
                    endpoint: 'http://www.example.com/bag/or/5/',
                    subtype: 'kunstwerk'
                }, {
                    label: 'Link #6',
                    endpoint: 'http://www.example.com/bag/or/6/',
                    subtype: 'weg'
                }, {
                    label: 'Link #7',
                    endpoint: 'http://www.example.com/bag/or/7/',
                    subtype: 'weg'
                }, {
                    label: 'Link #8',
                    endpoint: 'http://www.example.com/bag/or/8/',
                    subtype: 'weg'
                }, {
                    label: 'Link #9',
                    endpoint: 'http://www.example.com/bag/or/9/',
                    subtype: 'weg'
                }, {
                    label: 'Link #10 - Vereniging van Eigenaren',
                    endpoint: 'http://www.example.com/bag/or/10/',
                    subtype: 'weg'
                }, {
                    label: 'Link #11',
                    endpoint: 'http://www.example.com/bag/or/11/',
                    subtype: 'weg'
                }, 'not an object link'
            ]
        };

        spyOn(store, 'dispatch');
    });

    function getComponent (category, limitResults) {
        var component,
            element,
            scope;

        element = document.createElement('dp-search-results-list');
        element.setAttribute('category', 'category');
        element.setAttribute('limit-results', 'limitResults');

        scope = $rootScope.$new();
        scope.category = category;
        scope.limitResults = limitResults;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('lists search results', function () {
        var component = getComponent(mockedCategory, false);

        expect(component.find('dp-link').length).toBe(12);

        expect(component.find('dp-link').eq(0).find('button').text().trim()).toBe('Link #1');
        expect(component.find('.qa-search-results__link-extra-info').eq(0).text().trim()).toBe('(nevenadres)');
        component.find('dp-link').eq(0).find('button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'http://www.example.com/bag/or/1/'
        });

        expect(component.find('dp-link').eq(1).find('button').text().trim())
            .toBe('Link #2');
        expect(component.find('.qa-search-results__link-extra-info').eq(1).text().trim())
            .toBe('(verblijfsobject gevormd)');

        expect(component.find('dp-link').eq(2).find('button').text().trim())
            .toBe('Link #3');
        expect(component.find('.qa-search-results__link-extra-info').eq(2).text().trim())
            .toBe('(nevenadres) (verblijfsobject gevormd)');

        expect(component.find('dp-link').eq(3).find('button').text().trim()).toBe('');
        expect(component.find('dp-link').eq(10).find('button').text().trim()).toBe('Link #11');
        component.find('dp-link').eq(10).find('button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DETAIL,
            payload: 'http://www.example.com/bag/or/11/'
        });
    });

    it('optionally limits the number of search results', function () {
        var component;

        // Without the limiter
        component = getComponent(mockedCategory, false);
        expect(component.find('dp-link').length).toBe(12);

        // With the limiter
        component = getComponent(mockedCategory, true);
        expect(component.find('dp-link').length).toBe(10);
    });

    it('applies the longNameShortener filter', function () {
        var component = getComponent(mockedCategory, false);

        expect(component.find('dp-link').eq(9).find('button').text()).not.toContain('Vereniging van Eigenaren');
        expect(component.find('dp-link').eq(9).find('button').text()).toContain('VVE');
    });

    it('shows the type of openbare ruimte when it\'s something else than \'Weg\'', function () {
        var component = getComponent(mockedCategory);

        // Wegen
        [0, 1, 2, 5, 6, 7, 8, 9, 10, 11].forEach(function (index) {
            expect(component.find('li').eq(index).text()).not.toContain('(weg)');
        });

        // Water
        expect(component.find('li').eq(3).text()).toContain('(water)');

        // Kunstwerk
        expect(component.find('li').eq(4).text()).toContain('(kunstwerk)');
    });

    it('shows the type of gebied', function () {
        var component,
            mockedGebiedenCategory = {
                slug: 'gebieden',
                count: 2,
                results: [
                    {
                        label: 'Link #1',
                        endpoint: 'http://www.example.com/gebied/1/',
                        subtype: 'buurt'
                    }, {
                        label: 'Link #2',
                        endpoint: 'http://www.example.com/gebied/2/',
                        subtype: 'bouwblok'
                    }
                ]
            };

        component = getComponent(mockedGebiedenCategory);

        expect(component.find('li').eq(0).text()).toContain('(buurt)');
        expect(component.find('li').eq(1).text()).toContain('(bouwblok)');
    });

    it('shows the type of adressen, except for verblijfsobjecten', function () {
        var component,
            mockedGebiedenCategory = {
                slug: 'adres',
                count: 3,
                results: [
                    {
                        label: 'Link #1',
                        endpoint: 'http://www.example.com/gebied/1/',
                        subtype: 'verblijfsobject'
                    }, {
                        label: 'Link #2',
                        endpoint: 'http://www.example.com/gebied/2/',
                        subtype: 'standplaats'
                    }, {
                        label: 'Link #3',
                        endpoint: 'http://www.example.com/gebied/3/',
                        subtype: 'ligplaats'
                    }
                ]
            };

        component = getComponent(mockedGebiedenCategory);

        expect(component.find('li').eq(0).text()).not.toContain('(verblijfsobject)');
        expect(component.find('li').eq(1).text()).toContain('(standplaats)');
        expect(component.find('li').eq(2).text()).toContain('(ligplaats)');
    });

    it('doesn\'t show the type when the value is null', function () {
        var component,
            mockedGebiedenCategory = {
                slug: 'adres',
                count: 1,
                results: [
                    {
                        label: 'Link #1',
                        endpoint: 'http://www.example.com/gebied/1/',
                        subtype: null
                    }
                ]
            };

        component = getComponent(mockedGebiedenCategory);

        expect(component.find('li').eq(0).text()).not.toContain('()');
    });
});
