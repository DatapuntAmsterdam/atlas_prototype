'use strict';

module.exports = menuDropdownElement => ({
    toggle: () => {
        return menuDropdownElement.element(by.css('.qa-menu__toggle .qa-menu__link')).click();
    },

    items: index => {
        return itemPageObject(menuDropdownElement.all(by.css('ul li')).get(index));
    },

    get itemCount () {
        return dp.count(menuDropdownElement.all(by.css('ul li')));
    }
});

function itemPageObject (menuItem) {
    return {
        get text () {
            return menuItem.element(by.css('.qa-dp-link')).getText();
        },
        click: () => {
            return menuItem.element(by.css('.qa-dp-link')).click();
        }
    };
}
