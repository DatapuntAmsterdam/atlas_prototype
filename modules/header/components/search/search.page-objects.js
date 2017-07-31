'use strict';

module.exports = searchElement => ({
    setQuery: function (query) {
        const inputElement = searchElement.element(by.model('query'));

        inputElement.clear();
        inputElement.sendKeys(query);
    },

    submit: searchElement.element(by.css('form')).submit
});
