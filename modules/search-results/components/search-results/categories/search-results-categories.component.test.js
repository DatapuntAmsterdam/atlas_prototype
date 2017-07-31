describe('The dp-search-results-categories component', () => {
    let $compile,
        $rootScope,
        user,
        mockedSearchResults;

    beforeEach(() => {
        angular.mock.module(
            'dpSearchResults',
            {
                // Store is used in the child directive dp-link
                store: {
                    dispatch: angular.noop
                }
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _user_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            user = _user_;
        });

        mockedSearchResults = [
            {
                label_singular: 'Adres',
                label_plural: 'Adressen',
                slug: 'adres',
                count: 10
            },
            {
                label_singular: 'Object',
                label_plural: 'Objecten',
                slug: 'object',
                count: 1
            },
            {
                label_singular: 'Item',
                label_plural: 'Items',
                slug: 'item',
                count: 0
            },
            {
                label_singular: 'Gebied',
                label_plural: 'Gebieden',
                slug: 'gebied',
                count: 11
            },
            {
                label_singular: 'Openbare ruimte',
                label_plural: 'Openbare ruimtes',
                slug: 'openbare_ruimte',
                count: 11,
                more: {
                    label: 'More',
                    endpoint: 'Endpoint'
                }
            },
            {
                label_singular: 'Pand',
                label_plural: 'Panden',
                slug: 'pand',
                count: 0,
                warning: 'Warning'
            },
            {
                label_singular: 'Kadastraal object',
                label_plural: 'Kadastrale objecten',
                slug: 'kadastraal_object',
                count: 8,
                authLevel: 'EMPLOYEE'
            },
            {
                label_singular: 'Kadastraal subject',
                label_plural: 'Kadastrale subjecten',
                slug: 'kadastraal_subject',
                count: 2,
                subResults: [
                    {
                        label_singular: 'Adres',
                        label_plural: 'Adressen',
                        slug: 'adres',
                        count: 10
                    }
                ]
            }
        ];

        spyOn(user, 'meetsRequiredLevel');
    });

    function getComponent (categories) {
        const element = document.createElement('dp-search-results-categories');
        const scope = $rootScope.$new();

        element.setAttribute('categories', 'categories');
        scope.categories = categories;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('with normal search results', () => {
        let component;
        let isolateScope;
        let categories;
        let categoryNode;

        beforeEach(() => {
            component = getComponent(mockedSearchResults);
            isolateScope = component.isolateScope();
            categories = component.find('.qa-search-results-category');
            categoryNode = component.find('.qa-search-results-category').eq(0);
        });

        it('iterates over the categories', () => {
            expect(isolateScope.vm.categories).toBe(mockedSearchResults);
            expect(categories.attr('ng-repeat')).toBe('category in vm.categories');
        });

        it('shows each category', () => {
            expect(categories.length).toBe(7);
        });

        it('displays a plural header label', () => {
            const header = categoryNode.find('.qa-search-header');
            expect(header.text().trim()).toBe('Adressen (10)');
        });

        it('does not show a warning panel', () => {
            const panel = categoryNode.find('.qa-category-warning');
            expect(panel.length).toBe(0);
        });

        it('does not show a show more link', () => {
            const link = categoryNode.find('.qa-show-more');
            expect(link.length).toBe(0);
        });

        it('passes the category results to the results list', () => {
            const lists = component.find('.qa-search-results-list');

            expect(lists.length).toBe(7);
            expect(lists.attr('category')).toBe('category');
        });
    });

    describe('category with exactly one result', () => {
        it('displays a singular header label', () => {
            const component = getComponent(mockedSearchResults);
            const categoryNode = component.find('.qa-search-results-category').eq(1);
            const header = categoryNode.find('.qa-search-header');

            expect(header.text().trim()).toBe('Object');
        });
    });

    describe('category with empty results', () => {
        it('is hidden when the category has no count', () => {
            const component = getComponent(mockedSearchResults);
            const categoryNode = component.find('.qa-search-results-category').eq(2);
            const header = categoryNode.find('.qa-search-header');

            expect(header.text().trim()).not.toContain('Item');
            expect(header.text().trim()).toContain('Gebied');
        });
    });

    describe('category with more than ten results', () => {
        let component;
        let categoryNode;
        let link;

        beforeEach(() => {
            component = getComponent(mockedSearchResults);
            categoryNode = component.find('.qa-search-results-category').eq(2);
            link = categoryNode.find('.qa-show-more');
        });

        it('shows a show more link', () => {
            expect(link.text().trim()).toBe('Toon alle 11');
        });

        it('uses the slug as payload for the show more link', () => {
            expect(link.attr('type')).toBe('FETCH_SEARCH_RESULTS_CATEGORY');
            expect(link.attr('payload')).toBe('category.slug');
        });
    });

    describe('category with more than 1000 results', () => {
        it('uses a thousand separator in the show more link', () => {
            mockedSearchResults[2].count = 1234;

            const component = getComponent(mockedSearchResults);
            const categoryNode = component.find('.qa-search-results-category').eq(2);
            const link = categoryNode.find('.qa-show-more');

            expect(link.text().trim()).toBe('Toon alle 1.234');
        });
    });

    describe('category with a separate page for more results', () => {
        let component;
        let categoryNode;
        let link;

        beforeEach(() => {
            component = getComponent(mockedSearchResults);
            categoryNode = component.find('.qa-search-results-category').eq(3);
            link = categoryNode.find('.qa-show-more');
        });

        it('shows a more link with a custom label', () => {
            expect(link.text().trim()).toBe('More');
        });

        it('uses the custom endpoint as payload for the more link', () => {
            expect(link.attr('type')).toBe('FETCH_DETAIL');
            expect(link.attr('payload')).toBe('category.more.endpoint');
        });
    });

    describe('category with a warning message', () => {
        let component;
        let categoryNode;

        beforeEach(() => {
            component = getComponent(mockedSearchResults);
            categoryNode = component.find('.qa-search-results-category').eq(4);
        });

        it('displays a plural header label', () => {
            const header = categoryNode.find('.qa-search-header');
            expect(header.text().trim()).toBe('Panden');
        });

        it('shows a warning panel', () => {
            const panel = categoryNode.find('.qa-category-warning');
            expect(panel.text()).toContain('Warning');
        });
    });

    describe('category with a required auth level', () => {
        let component;
        let categories;
        let categoryNode;
        let header;

        function before () {
            component = getComponent(mockedSearchResults);
            categories = component.find('.qa-search-results-category');
            categoryNode = categories.eq(5);
            header = categoryNode.find('.qa-search-header');
        }

        it('is hidden when the user doesn\'t have the required auth level', () => {
            user.meetsRequiredLevel.and.returnValue(false);
            before();
            expect(categories.length).toBe(7);
            expect(header.text().trim()).not.toContain('Kadastrale objecten');
            expect(header.text().trim()).not.toContain('Kadastraal object');
            expect(header.text().trim()).toContain('Kadastrale subjecten');
        });

        it('is shown when the user has the required auth level ', () => {
            user.meetsRequiredLevel.and.returnValue(true);
            before();
            expect(categories.length).toBe(8);
            expect(header.text().trim()).toBe('Kadastrale objecten (8)');
        });
    });

    describe('sub results', () => {
        let component;
        let categories;
        let normalCategory;
        let parentCategory;
        let lastCategory;
        let nestedComponent;
        let subCategories;
        let noneSubCategories;

        beforeEach(() => {
            component = getComponent(mockedSearchResults);
            categories = component.find('.qa-search-results-category');
            // Category with no sub results
            normalCategory = categories.eq(0);
            // Category with sub results
            parentCategory = categories.eq(5);
            // Index 6 of the categories will also be the sub results, because
            // these will also be found by the find method
            lastCategory = categories.eq(6);
            // The nested dp-search-results-categories component for the sub
            // results
            nestedComponent = parentCategory.find('dp-search-results-categories');
            // The categories of the sub results
            subCategories = parentCategory.find('.qa-search-results-category');
            // The (none existing) categories of the (none existing) sub
            // results of the normal category
            noneSubCategories = normalCategory.find('.qa-search-results-category');
        });

        it('are shown when available', () => {
            expect(lastCategory[0]).toBe(subCategories[0]);
            expect(subCategories.length).toBe(1);
            expect(nestedComponent.attr('categories')).toBe('category.subResults');
        });

        it('are hidden when not available', () => {
            expect(noneSubCategories.length).toBe(0);
        });
    });
});
