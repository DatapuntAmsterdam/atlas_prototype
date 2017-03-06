'use strict';

const loginPageObjects = dp.require('e2e/authorization/page-objects/login.page-objects');
const dashboardPageObjects = dp.require('modules/atlas/components/dashboard/dashboard.page-objects');

module.exports = function (pageName, role) {
    browser.get(dp.availableStates[pageName].url);

    /*
    browser.ignoreSynchronization = true;

    element(by.css('.qa-header__login')).click();

    const loginPage = loginPageObjects(element(by.css('body')));

    loginPage.username.setText('Henk');
    loginPage.password.setText('geheim');
    loginPage.submit();
    */
    return {
        get title () {
            return browser.getTitle();
        },
        get dashboard () {
            return dashboardPageObjects(element(by.css('dp-dashboard')));
        }
    };
};
