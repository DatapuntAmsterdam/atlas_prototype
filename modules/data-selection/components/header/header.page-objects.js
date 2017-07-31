'use strict';

const toggleViewButton =
    dp.require('modules/data-selection/components/header/toggle-view-button/toggle-view-button.page-objects');

module.exports = headerElement => ({
    get title () {
        return headerElement.element(by.css('.qa-title')).getText();
    },

    get toggleViewButton () {
        return toggleViewButton(headerElement.element(by.css('dp-data-selection-toggle-view-button')));
    },

    tabs: function (index) {
        return tabPageObject(headerElement.element(by.repeater('tab in vm.tabs').row(index)));
    }
});

function tabPageObject (tabElement) {
    return {
        get label () {
            return tabElement.getText();
        },
        get isActive () {
            return dp.hasClass(tabElement, 'is-active');
        }
    };
}
