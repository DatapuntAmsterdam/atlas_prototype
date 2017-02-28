'use strict';

const dashboardPageObjects = dp.require('modules/atlas/components/dashboard/dashboard.page-objects');

module.exports = function (pageName, role) {
    // Todo: Do something with the role (DEFAULT, EMPLOYEE or EMPLOYEE_PLUS)

    browser.get(dp.availableStates[pageName].url);

    return {
        get title () {
            return browser.getTitle();
        },
        get dashboard () {
            return dashboardPageObjects(element(by.css('dp-dashboard')));
        }
    };
};
