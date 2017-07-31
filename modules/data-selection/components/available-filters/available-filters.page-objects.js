'use strict';

module.exports = availableFiltersElement => ({
    get visible () {
        return availableFiltersElement.isPresent();
    },

    categories: function (index) {
        return categoryPageObject(
            availableFiltersElement.element(by.repeater('filter in vm.availableFilters').row(index))
        );
    }
});

function categoryPageObject (categoryElement) {
    return {
        get header () {
            return categoryElement.element(by.css('.qa-category-header')).getText();
        },
        options: function (index) {
            return optionPageObject(categoryElement.element(by.repeater('option in filter.options').row(index)));
        }
    };
}

function optionPageObject (optionElement) {
    return {
        get label () {
            return optionElement.element(by.css('.qa-option-label')).getText();
        },
        click: optionElement.element(by.css('button')).click
    };
}
