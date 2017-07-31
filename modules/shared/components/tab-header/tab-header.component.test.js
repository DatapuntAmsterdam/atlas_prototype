describe('The tabHeader component', () => {
    let $compile,
        $rootScope,
        mockedSearchText,
        mockedActiveItems,
        mockedInactiveItems;

    beforeEach(() => {
        mockedSearchText = 'AnySearchText';

        mockedActiveItems = [1].map(i => getMockedItem(i, {isActive: true, count: i})); // One active tab

        mockedInactiveItems = [0, 1, 2].map(i => getMockedItem(i, {count: i || null})); // Multipe inactive tabs

        angular.mock.module('dpShared',
            $provide => {
                $provide.factory('dpLinkDirective', () => ({}));
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getMockedItem (id, tpl = {}) {
        const mockedItem = { title: 'title' + id, action: 'action' + id, payload: 'payload' + id };
        return angular.merge(mockedItem, tpl);
    }

    function getComponent (title, tabs) {
        const element = document.createElement('dp-tab-header');
        element.setAttribute('search-text', title);
        element.setAttribute('tab-header', 'tabHeader');

        const scope = $rootScope.$new();

        scope.tabHeader = {tabs};

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('accepts a title and an array of tabs', () => {
        const component = getComponent(mockedSearchText, []);
        expect(component.find('ul dp-link').length).toBe(0);
        expect(component.find('.qa-tab-header__active').length).toBe(0);
    });

    it('shows the search text in the header', () => {
        const component = getComponent(mockedSearchText, mockedActiveItems);
        expect(component.find('.qa-tab-header__title .c-tab-header__title__text').text()
            .trim()).toBe('Resultaten met \'AnySearchText\'');
    });

    it('does show "Geen resultaten" and the search text in the header when no results are found', () => {
        const component = getComponent(mockedSearchText, []);
        expect(component.find('.qa-tab-header__title .c-tab-header__title__text').text()
            .trim()).toBe('Geen resultaten met \'AnySearchText\'');
    });

    it('shows a tip when no results are found', () => {
        const component = getComponent(mockedSearchText, []);
        expect(component.text()).toContain('Tip: ');
    });

    it('does not show the search text in the header when any count is null', () => {
        const component = getComponent(mockedSearchText, mockedInactiveItems);
        expect(component.find('.qa-tab-header__title').text().trim()).toBe('');
    });

    it('shows a link with the title for each non-active tab', () => {
        mockedInactiveItems[0].count = 0;
        const component = getComponent(mockedSearchText, mockedInactiveItems);
        expect(component.find('ul dp-link').length).toBe(mockedInactiveItems.length);
        mockedInactiveItems.forEach((item, i) => {
            expect(component.find('ul dp-link').eq(i).text().trim())
                .toBe(item.title + ' (' + item.count + ')');
            expect(component.find('ul dp-link').eq(i).attr('type')).toBe(item.action);
            expect(component.find('ul dp-link').eq(i).attr('payload')).toBe('tab.payload');
        });
        expect(component.find('.qa-tab-header__active').length).toBe(0);
    });

    it('shows a tab with the title and number of items for the active tab', () => {
        const component = getComponent(mockedSearchText, mockedActiveItems);
        expect(component.find('ul dp-link').length).toBe(0);
        expect(component.find('.qa-tab-header__active').length).toBe(mockedActiveItems.length);
        mockedActiveItems.forEach((item, i) => {
            expect(component.find('.qa-tab-header__active').eq(i).text().trim())
                .toBe(item.title + ' (' + item.count + ')');
        });
    });

    it('shows tabs for inactive and active items', () => {
        mockedInactiveItems[0].count = 0;
        const component = getComponent(mockedSearchText, mockedActiveItems.concat(mockedInactiveItems));
        expect(component.find('ul dp-link').length).toBe(mockedInactiveItems.length);
        expect(component.find('.qa-tab-header__active').length).toBe(mockedActiveItems.length);
    });
});
