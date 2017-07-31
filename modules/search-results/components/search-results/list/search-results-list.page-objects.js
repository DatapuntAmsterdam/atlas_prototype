'use strict';

const link = dp.require('modules/shared/components/link/link.page-objects');

module.exports = searchResultsListElement => index => listItemPageObject(
    searchResultsListElement.element(by.repeater('link in vm.category.results').row(index))
);

function listItemPageObject (listItemElement) {
    return {
        get link () {
            return link(listItemElement.element(by.css('dp-link')));
        },
        get subtype () {
            return listItemElement.element(by.css('.qa-subtype')).getText();
        }
    };
}
