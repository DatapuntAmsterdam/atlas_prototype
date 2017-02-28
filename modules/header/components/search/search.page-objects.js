'use strict';

module.exports = function (searchElement) {
    return {
        setQuery: function (query) {
            const inputElement = searchElement.element(by.model('query'));

            inputElement.clear();
            inputElement.sendKeys(query);
        },
        get autocomplete () {
            return {
                categories: function (index) {
                    const category = searchElement.element(by.repeater('category in suggestions').row(index));

                    return {
                        get isPresent () {
                            return category.isPresent();
                        },
                        get header () {
                            return searchElement.element(by.css('.qa-autocomplete-header')).getText();
                        },
                        options: function (index) {
                            const option = category.element(by.repeater('suggestion in category.content').row(index));

                            return {
                                get label () {
                                    return option.getText();
                                }
                            };
                        }
                    };
                }
            };
        },
        submit: searchElement.element(by.css('form')).submit
    };
};
