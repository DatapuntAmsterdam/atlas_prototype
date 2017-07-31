'use strict';

const homepagePO = dp.require('modules/page/components/homepage/homepage.page-objects');

module.exports = pageElement => ({
    get visible () {
        return dp.visible(pageElement);
    },

    get homepage () {
        return homepagePO(pageElement.element(by.css('dp-homepage')));
    }
});
