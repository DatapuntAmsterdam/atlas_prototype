describe('The tabHeader component', function () {
    let $compile,
        $rootScope,
        mockedSearchText,
        mockedActiveItems,
        mockedInactiveItems;

    beforeEach(function () {
        mockedSearchText = 'AnySearchText';

        mockedActiveItems = [1].map(i => getMockedItem(i, {isActive: true, count: i})); // One active tab

        mockedInactiveItems = [0, 1, 2].map(i => getMockedItem(i, {count: i || null})); // Multipe inactive tabs

        angular.mock.module('dpShared',
            function ($provide) {
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getMockedItem (id, tpl = {}) {
        let mockedItem = { title: 'title' + id, action: 'action' + id, payload: 'payload' + id };
        return angular.merge(mockedItem, tpl);
    }

    function getComponent (title, tabs) {
        let component,
            element,
            scope;

        element = document.createElement('dp-tab-header');
        element.setAttribute('search-text', title);
        element.setAttribute('tab-header', 'tabHeader');

        scope = $rootScope.$new();

        scope.tabHeader = {tabs};

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('accepts a title and an array of tabs', function () {
        let component = getComponent(mockedSearchText, []);
        expect(component.find('.qa-tab-header__title').text()).toBe(`Resultaten met "${mockedSearchText}"`);
        expect(component.find('ul dp-link').length).toBe(0);
        expect(component.find('.qa-tab-header__active').length).toBe(0);
    });

    it('shows a link with the title for each non-active tab', function () {
        let component = getComponent(mockedSearchText, mockedInactiveItems);
        expect(component.find('ul dp-link').length).toBe(mockedInactiveItems.length);
        mockedInactiveItems.forEach((item, i) => {
            expect(component.find('ul dp-link').eq(i).text().trim())
                .toBe(item.title + (i ? ' (' + item.count + ')' : ''));
            expect(component.find('ul dp-link').eq(i).attr('type')).toBe(item.action);
            expect(component.find('ul dp-link').eq(i).attr('payload')).toBe('tab.payload');
        });
        expect(component.find('.qa-tab-header__active').length).toBe(0);
    });

    it('shows a tab with the title and number of items for the active tab', function () {
        let component = getComponent(mockedSearchText, mockedActiveItems);
        expect(component.find('ul dp-link').length).toBe(0);
        expect(component.find('.qa-tab-header__active').length).toBe(mockedActiveItems.length);
        mockedActiveItems.forEach((item, i) => {
            expect(component.find('.qa-tab-header__active').eq(i).text().trim())
                .toBe(item.title + ' (' + item.count + ')');
        });
    });

    it('shows tabs for inactive and active items', function () {
        let component = getComponent(mockedSearchText, mockedActiveItems.concat(mockedInactiveItems));
        expect(component.find('ul dp-link').length).toBe(mockedInactiveItems.length);
        expect(component.find('.qa-tab-header__active').length).toBe(mockedActiveItems.length);
    });
});
