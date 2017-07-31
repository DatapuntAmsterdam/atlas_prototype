const linkPO = dp.require('modules/shared/components/link/link.page-objects');

module.exports = homepageElement => ({
    get map () {
        return linkPO(homepageElement.element(by.css('.qa-map-link dp-link')));
    },

    get straatbeeld () {
        return linkPO(homepageElement.element(by.css('.qa-straatbeeld-link dp-link')));
    }
});
