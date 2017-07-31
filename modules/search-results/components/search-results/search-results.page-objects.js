'use strict';

const
    searchResultsList = dp.require(
        'modules/search-results/components/search-results/list/search-results-list.page-objects'),
    straatbeeldThumbnail = dp.require(
        'modules/shared/components/straatbeeld-thumbnail/straatbeeld-thumbnail.page-objects'),
    link = dp.require('modules/shared/components/link/link.page-objects');

module.exports = searchResultsElement => ({
    get visible () {
        return dp.visible(searchResultsElement);
    },

    get straatbeeldThumbnail () {
        return straatbeeldThumbnail(searchResultsElement.element(by.css('dp-straatbeeld-thumbnail')));
    },

    categories: function (index) {
        return categoryPageObject(
            searchResultsElement.element(by.repeater('category in vm.categories').row(index))
        );
    }
});

function categoryPageObject (categoryElement) {
    return {
        get header () {
            return categoryElement.element(by.css('.qa-search-header')).getText();
        },
        get headerCount () {
            return categoryElement.element(by.css('.qa-search-header-count')).getText();
        },
        get list () {
            return searchResultsList(categoryElement.element(by.css('dp-search-results-list')));
        },
        get listCount () {
            return dp.count(categoryElement.all(by.css('ul li')));
        },
        get showMore () {
            return link(categoryElement.element(by.css('.qa-show-more')));
        }
    };
}
