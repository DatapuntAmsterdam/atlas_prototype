'use strict';

module.exports = function (loginElement) {
    return {
        get username () {
            return textField(loginElement.element(by.css('input[name="Ecom_User_ID"]')));
        },
        get password () {
            return textField(loginElement.element(by.css('input[name="Ecom_Password"]')));
        },
        submit: loginElement.element(by.css('#IDPLogin')).submit
    };
};

function textField (textFieldElement) {
    return {
        setText: function (input) {
            textFieldElement.clear();
            textFieldElement.sendKeys(input);
        }
    };
}
