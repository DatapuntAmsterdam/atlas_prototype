'use strict';

const isVisible = require('../../../../e2e/helpers/is-visible');

const loginPageObjects = require('./../login-form/login-form.page-objects.js');

module.exports = function (pageElement) {
    return function () {
        return {
            isVisible: isVisible(pageElement),
            text: pageElement.getText,
            login: loginPageObjects(pageElement.element(by.css('dp-login')))
        };
    };
};
